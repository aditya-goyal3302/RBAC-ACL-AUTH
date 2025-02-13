class RabbitMQSetup {
  /**
   * Create a RabbitMQSetup instance.
   * @param {Object} RabbitMqConnection - The RabbitMQ connection object.
   */
  constructor(rabbitMqConnection) {
    this.connection = rabbitMqConnection;
    this.config = this.connection.getConnectionConfiguration();
  }

  /**
   * Configure the RabbitMQ exchanges and queues.
   */
  async configure() {
    await this.connection.exchange(this.config.fanoutExchange, "fanout");
    await this.connection.exchange(this.config.directExchange, "direct");

    await this.connection.queue(this.config.fanoutExchange, this.config.primaryQueue, "", { durable: true });
    await this.connection.queue(this.config.directExchange, this.config.retryQueue, this.config.retryBindingKey, {
      durable: true,
      deadLetterExchange: this.config.fanoutExchange,
      messageTtl: parseInt(this.config.retryQueueMessageTtl),
    });
  }
}

module.exports = {
  RabbitMQSetup,
};
