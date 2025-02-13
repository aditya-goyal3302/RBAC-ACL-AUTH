class Producer {
  /**
   * Create a Producer instance.
   * @param {Object} RabbitMQConnection - RabbitMQ Connection instance.
   */
  constructor({ rabbitMQConnection }) {
    this.connection = rabbitMQConnection;
    this.config = this.connection.getConnectionConfiguration();
  }

  /**
   * Publish a list of messages.
   * @param {Array} messages - The list of messages to be published.
   */
  async publishMessages(messages) {
    for (const message of messages) {
      await this._publisher(message);
    }

    await this._close();
  }

  /**
   * Publish a single message with error handling.
   * @param {Object} outboxMessage - The message object to be published.
   */
  _publisher = async (outboxMessage) => {
    try {
      const message = outboxMessage.getBody();
      const properties = outboxMessage.getProperties();

      const isPublished = await this.connection.publish(this.config.fanoutExchange, "", JSON.stringify(message), {
        ...properties,
        persistent: true,
      });
      if (!isPublished) throw new Error("Message could not be published.");

      console.log(`This message is sent to exchange ${this.config.fanoutExchange}`, message);

      await outboxMessage.markAsSent();
      // await outboxMessage.save();
    } catch (error) {
      console.log(`Error while publishing message ${outboxMessage.type} with id ${outboxMessage.message_id}`, error);
    }
  };

  /**
   * Close the RabbitMQ channel.
   */
  async _close() {
    await this.connection.closeChannel();
  }
}

module.exports = Producer;
