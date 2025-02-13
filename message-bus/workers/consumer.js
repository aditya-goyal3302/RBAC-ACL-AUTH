
class Consumer {
      /**
     * Create a Consumer instance.
     * @param {Object} RabbitMQConnection - RabbitMQ Connection instance.
     */
    constructor({ rabbitMQConnection, messageHandler, limit }) {
        this.connection = rabbitMQConnection;
        this.config = this.connection.getConnectionConfiguration();
        this.messageHandler = messageHandler;
        this.channel = null;
        this.signatureTypes = null;
        this.prefetchLimit = limit || 10;
        this.signatureTypes = this.messageHandler.getSignatureType();
        
        this.connection.rabbitMqEvents.on("connected",()=>{
            console.log("RabbitMQ connected");
            this._consume();
        });
    }

    /**
     * Connect to RabbitMQ and configure the necessary exchanges and queues.
     */
    async _consume() {
        this.channel = this.connection.getChannel();
        this.channel.prefetch(this.prefetchLimit);
        await this.startConsuming();
        console.log(`Waiting for messages in ${this.config.primaryQueue}...`);
    }

    /**
     * initialize consumer operation
     */
    init(){
        this._consume();
    }
    /**
     * Check if a message has been redelivered too many times.
     * @param {number} redeliveryCount - The number of times the message has been redelivered.
     * @returns {boolean} - True if the redelivery count exceeds the configured limit, otherwise false.
     */
    _hasBeenRedeliveredTooMuch(redeliveryCount) {
        return (parseInt(redeliveryCount) >= parseInt(this.config.delayedRetriesNumber));
    }

    /**
     * Handle an error by either moving the message to the dead-letter queue or retrying the message.
     * @param {object} message - The message that caused the error.
     * @param {Error} error - The error encountered during message processing.
     * @param {number} redeliveryCount - The number of times the message has been redelivered.
     */
    async _handleError(message, error, redeliveryCount) {
        if (this._hasBeenRedeliveredTooMuch(redeliveryCount)) await this.connection.deadLetter(message, error);
        else await this.connection.retry(message, error);
    }

    /**
     * Starts consuming messages from the primary queue.
     */
    async startConsuming() {
        await this.channel.consume(this.config.primaryQueue, async (message) => {
            if (message === null) return;

            console.log("\n\n================= NEW MESSAGE CONSUMING AT", new Date(), "=================");

            const redeliveryCount = message.properties.headers['redelivery_count'] || 0;
            const type = message?.properties?.type || message?.properties?.headers?.type;

            console.log('INFO Received message:', type, "|", 'Message redelivery count:', redeliveryCount);

            if (!message.properties?.messageId) {
                console.log('INFO Message ignored: Message does not have a messageId.');
                this?.channel.ack(message);
                return;
            }
            if (!type || !this.signatureTypes.includes(type)) {
                console.log("INFO Message ignored: No available handler found or missing message type property.");
                this?.channel.ack(message);
                return;
            }

            try {
                await this.messageHandler.handleMessage(message, parseInt(this.config.immediateRetriesNumber));
            } catch (error) {
                await this._handleError(message, error, redeliveryCount);
            } finally {
                this?.channel.ack(message);
            }
        });
    }
}

module.exports = Consumer;