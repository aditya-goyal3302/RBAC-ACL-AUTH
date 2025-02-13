const amqp = require("amqplib");
const EventEmitter = require("events");

/**
 * @typedef {Object} ConnectParams
 * @property {RabbitMQConfigObj} rabbitMQConfig - Configuration settings for the RabbitMQ connection.
 * @property {string} reconnectPolicy - The policy for reconnecting. Optional.
 * @property {number} maxReconnectTries - The number of times to retry reconnecting. Optional.
 */
class RabbitMQConnection {
  /**
   * Create a RabbitMQConnection instance.
   * @param {ConnectParams} params - The params object for RabbitMQ connection.
   */
  constructor({ rabbitMQConfig, reconnectPolicy = false, maxReconnectTries }) {
    this._rabbitMqConfig = rabbitMQConfig;
    this.config = this._rabbitMqConfig.getConfig();
    this.rabbitMqEvents = new EventEmitter();
    this._maxReconnectTries = reconnectPolicy ? maxReconnectTries || 3 : 0;
    this._reconnectTries = 0;
    this._isMaxReconnectPolicyApplied = reconnectPolicy;
    this.connection = null;
    this.channel = null;
    this.timeout = null;
  }

  /**
   * Connect to RabbitMQ server and set up connection and channel.
   */
  async connect() {
    console.log("Connecting to RabbitMQ...")
    try {
      if (this.timeout) clearTimeout(this.timeout);
      this.connection = await this.createConnection();
      console.log("RabbitMQ is connected.");

      this.channel = await this.createChannel();
      this.handleConnectionEvents();

      this.rabbitMqEvents.emit("connected");
      this._reconnectTries = 0;
    } catch (error) {
      console.log(`Failed to establish connection to RabbitMQ: ${error.message || error}`);
      await this._reconnect();
    }
  }
  /**
   * Return connection configuration.
   * @returns {RabbitMQConfigParams}  -RabbitMQ Configuration Parameters.
   */
  getConnectionConfiguration() {
    return this.config;
  }

  /**
   * Assert an exchange on the channel.
   * @param {string} exchange - The exchange name.
   * @param {string} exchangeType - The exchange type (e.g., 'fanout', 'direct').
   */
  async exchange(exchange, exchangeType) {
    await this.channel?.assertExchange(exchange, exchangeType, { durable: true });
  }

  /**
   * Handle Connection events
   */
  handleConnectionEvents() {
    this.connection.on("close", this._handleClose.bind(this));
    this.connection.on("error", this._handleError.bind(this));

    this.channel.on("error", (err) => {
      console.log("Error in channel", err);
    });

    this.channel.on("close", () => {
      console.log("Channel closed");
      this.channel = null;
      setTimeout(this._reconnect.bind(this), 5000);
    });
  }

  /**
   * Assert a queue and bind it to an exchange on the channel.
   * @param {string} exchange - The exchange name.
   * @param {string} queue - The queue name.
   * @param {string} [routingKey=""] - The routing key for the binding.
   * @param {Object} options - Queue options.
   */
  async queue(exchange, queue, routingKey = "", options = {}) {
    await this.channel?.assertQueue(queue, options);
    await this.channel?.bindQueue(queue, exchange, routingKey);
  }

  /**
   * Create a new connection to RabbitMQ server.
   * @returns {Object} The connection object.
   */
  async createConnection() {
    const connectionString = this._rabbitMqConfig.getConnectionString();
    const connectionParams = this._rabbitMqConfig.getConnectionParams();
    return amqp.connect(connectionString, connectionParams);
  }

  /**
   * Get the current channel.
   * @returns {Object} The channel object.
   */
  getChannel() {
    return this.channel;
  }

  /**
   * Create a new channel on the connection.
   * @returns {Object} The channel object.
   */
  async createChannel() {
    if (!this.connection) throw new Error("RabbitMQ connection has not been established yet.");
    const channel = await this.connection.createChannel();
    console.log("Channel created.");
    return channel;
  }

  /**
   * Close the current channel.
   */
  async closeChannel() {
    await this?.channel?.close();
    this.channel = null;
    console.log("Channel closed explicitly.");
  }

  /**
   * Publish a message to an exchange with a specific binding key.
   * @param {string} exchange - The exchange name.
   * @param {string} bindingKey - The binding key.
   * @param {string|Buffer} content - The message content.
   * @param {Object} properties - Message properties.
   * @returns {boolean} Whether the message was successfully published.
   */
  async publish(exchange, bindingKey, content, properties) {
    return this.channel?.publish(exchange, bindingKey, Buffer.from(content), properties);
  }

  /**
   * Move a message to the error queue when processing fails.
   * @param {object} message - The message to be moved to the error queue.
   * @param {Error} error - The error that caused the message to be moved to the error queue.
   * @returns {Promise<boolean>} Whether the message was successfully published to the error queue.
   */
  async deadLetter(message, error) {
    const properties = { ...message.properties, persistent: true };
    const poissonMessage = this._convertToPoissonMessageFormat(message, error);
    console.log(
      `ERROR RecoverabilityExecutor Moving message ${message?.properties?.messageId} to error queue because processing failed due to an exception:\n`,
      error
    );
    return this.publish(
      this.config.directExchange,
      this.config.errorBindingKey,
      JSON.stringify(poissonMessage),
      properties
    );
  }

  /**
   * Converts the given message and error details into the Poisson message format.
   *
   * @param {Object} message - The original message to be included in the Poisson message.
   * @param {Error} error - The error object containing details about the exception.
   * @return {Object} - The message formatted as a Poisson message.
   * @private
   */
  _convertToPoissonMessageFormat(message, error) {
    return {
      payload: JSON.parse(message.content?.toString() || "{}"),
      exception_details: {
        exception_type: error.message,
        stack_trace: error.stack,
        failed_at: new Date(),
      },
      endpoint: {
        name: this.config.appName,
        delivery_metadata: {
          message_type: message?.properties?.type || message?.properties?.headers?.type,
          exchange: message.fields.exchange,
          routing_key: message.fields.routingKey,
        },
      },
    };
  }

  /**
   * Retry handling the message by publishing it to the retry queue with updated properties.
   * @param {object} message - The message to be retried.
   * @param {Error} error - The error that caused the retry.
   * @returns {Promise<boolean>} Whether the message was successfully published to the retry queue.
   */
  async retry(message, error) {
    const messageProperties = this._incrementRedeliveryCountAndSetTTL(message);
    const properties = { ...messageProperties, persistent: true };

    console.log(
      `WARN RecoverabilityExecutor Delayed Retries will reschedule message ${
        message.properties.messageId
      } after a delay of ${message.properties.expiration / 1000} seconds because of exception:\n`,
      error
    );
    return this.publish(this.config.directExchange, this.config.retryBindingKey, message.content, properties);
  }

  /**
   * Increment the redelivery count and set the message TTL for retries.
   * @param {object} message - The message object.
   * @returns {object} - Updated message properties with incremented redelivery count and TTL.
   * @private
   */
  _incrementRedeliveryCountAndSetTTL(message) {
    const redeliveryCount = parseInt(message.properties.headers["redelivery_count"] || 0);
    message.properties.headers["redelivery_count"] = redeliveryCount + 1;
    message.properties.expiration = message.properties.headers["redelivery_count"] * 2000; // Exponential backoff: 2 seconds base delay

    return message.properties;
  }

  /**
   * Handle the connection close event.
   * @private
   */
  async _handleClose() {
    console.log("Disconnected from RabbitMQ");
    if (this.timeout) clearTimeout(this.timeout);
    await this._reconnect();
  }

  /**
   * Handle the connection error event.
   * @param {Error} e - The error object.
   * @private
   */
  async _handleError(e) {
    console.log("Error in RabbitMQ connection", e);
    if (this.timeout) clearTimeout(this.timeout);
    await this._reconnect();
  }

  /**
   * Attempt to reconnect to RabbitMQ server after a delay.
   * @private
   */
  async _reconnect() {
    return new Promise((resolve) => {
      this.timeout = setTimeout(async () => {
        console.log("Retires", this._reconnectTries);
        this._reconnectTries++;

        if (this._isMaxReconnectPolicyApplied && this._hasExceededMaxReconnects(this._reconnectTries)) {
          console.log("Maximum reconnect tries reached, Process exited");
          process.exit(1);
        }

        console.log("Reconnecting to RabbitMQ...", "Attempt:", this._reconnectTries, new Date());
        await this.connect(this._isMaxReconnectPolicyApplied);

        resolve();
      }, 5000); // Wait for 5 seconds before attempting to reconnect
    });
  }

  /**
   * @return {boolean} - True if reconnection attempts exceed the limit, otherwise false.
   * @private
   */
  _hasExceededMaxReconnects(reconnectTries) {
    return reconnectTries > this._maxReconnectTries;
  }
}

module.exports = {
  RabbitMQConnection,
};
