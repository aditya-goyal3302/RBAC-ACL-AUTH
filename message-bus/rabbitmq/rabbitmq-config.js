const amqp = require("amqplib");

/**
 * @typedef {Object} RabbitMQConfigParams
 * @property {string} username - RabbitMQ username.
 * @property {string} password - RabbitMQ password.
 * @property {string} host - RabbitMQ host.
 * @property {number} port - RabbitMQ port.
 * @property {string} vhost - RabbitMQ virtual host.
 * @property {string} appName - RabbitMQ app name.
 * @property {string} fanoutExchange - RabbitMQ fanout exchange name.
 * @property {string} directExchange - RabbitMQ direct exchange name.
 * @property {string} primaryQueue - RabbitMQ primary queue name.
 * @property {string} retryQueue - RabbitMQ retry queue name.
 * @property {string} retryBindingKey - RabbitMQ retry queue binding key.
 * @property {string} errorBindingKey - RabbitMQ error queue binding key.
 * @property {number} delayedRetriesNumber - Number of delayed retries for failed messages.
 * @property {number} immediateRetriesNumber - Number of immediate retries for failed messages.
 * @property {number} retryQueueMessageTtl - Time-to-live (TTL) for message retry in RabbitMQ queues, specified in milliseconds.
 */
const config = {
  username: process.env.RABBITMQ_USERNAME,
  password: process.env.RABBITMQ_PASSWORD,
  host: process.env.RABBITMQ_HOST,
  port: process.env.RABBITMQ_PORT,
  vhost: process.env.RABBITMQ_VHOST,
  appName: process.env.APP_NAME,
  fanoutExchange: process.env.RABBITMQ_FANOUT_EXCHANGE,
  directExchange: process.env.RABBITMQ_DIRECT_EXCHANGE,
  primaryQueue: process.env.RABBITMQ_PRIMARY_QUEUE,
  retryQueue: process.env.RABBITMQ_RETRY_QUEUE,
  retryBindingKey: process.env.RABBITMQ_RETRY_BINDING_KEY,
  errorBindingKey: process.env.RABBITMQ_ERROR_BINDING_KEY,
  delayedRetriesNumber: process.env.FAILED_MESSAGE_DELAYED_RETRIES,
  immediateRetriesNumber: process.env.FAILED_MESSAGE_IMMEDIATE_RETRIES,
  retryQueueMessageTtl: process.env.RETRY_QUEUE_MESSAGE_TTL,
};

/**
 * Class representing RabbitMQ configuration and utility methods.
 */
class RabbitMQConfig {
  /**
   * Create a RabbitMQConfig instance.
   * @param {RabbitMQConfigParams} config - The configuration object.
   */
  constructor() {
    this.config = config;
    this.validateConfig(config);
  }

  /**
   * Check that all required configuration variables are present.
   * Exits the process if any variables are missing.
   * @param {RabbitMQConfigParams} config - The configuration object.
   */
  validateConfig(config) {
    console.log("Checking prerequisites...: ");

    if (!config) {
      console.log(`Config is empty`);
      process.exit(1); // Exit the process with an error code
    }

    const requiredVariables = [
      "username",
      "password",
      "host",
      "port",
      "vhost",
      "appName",
      "fanoutExchange",
      "directExchange",
      "primaryQueue",
      "retryQueue",
      "retryBindingKey",
      "errorBindingKey",
      "delayedRetriesNumber",
      "immediateRetriesNumber",
      "retryQueueMessageTtl",
    ];

    const missingVariables = requiredVariables.filter((variable) => !config[variable]);

    if (missingVariables.length === 0) {
      console.log("All prerequisites are met for RabbitMQ.");
    } else {
      missingVariables.forEach((variable) => {
        console.log(`Missing required environment variable: ${variable}`);
      });
      process.exit(1); // Exit the process with an error code
    }
  }

  /**
   * Get the configuration object.
   * @returns {RabbitMQConfigParams} The configuration object containing RabbitMQ configuration parameters:
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get the RabbitMQ connection string.
   * @returns {string} The connection string.
   */
  getConnectionString() {
    return `${this.config.host}:${this.config.port}/${this.config.vhost}`;
  }

  /**
   * Get the connection parameters for RabbitMQ.
   * @returns {Object} The connection parameters.
   */
  getConnectionParams() {
    return {
      credentials: amqp.credentials.plain(this.config.username, this.config.password),
      heartbeat: 30, // Set the heartbeat interval for the connection
    };
  }
}

module.exports = {
  RabbitMQConfig,
};
