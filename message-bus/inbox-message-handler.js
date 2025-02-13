const processors = require("../processors");
const { jsonrepair } = require("jsonrepair");

class MessageHandler {
  /**
   * Create a MessageHandler instance.
   * @param {Object} signatureTypes - An object mapping message types to their handlers.
   */
  constructor(signatureTypes) {
    this.signatureTypes = signatureTypes;
  }

  /**
   * Get the list of supported message signature types.
   * @returns {Array<string>} An array of signature type keys.
   */
  getSignatureType() {
    return Object.keys(this.signatureTypes);
  }

  /**
   * Parses message content to JSON in a robust manner, handling errors and attempting to repair invalid JSON.
   * @param {object} message - The message object containing content to parse.
   * @returns {object} Parsed JSON object or an empty object if parsing fails.
   */
  robustParseMessageContent(message) {
    try {
      return JSON.parse(message.content.toString());
    } catch (err) {
      console.warn("WARNING: Failed to parse message content initially");
      const repairMessage = jsonrepair(message?.content?.toString() || "{}");
      return JSON.parse(repairMessage);
    }
  }

  /**
   * Handle an incoming message.
   * @param {Object} message - The message to be handled.
   * @param {number} max_retry_counts - The maximum number of retry attempts.
   * @returns {boolean} True if the message was handled successfully, otherwise false.
   */
  async handleMessage(message, max_retry_counts) {
    const inboxMessageRepository = require("../server").resolve("inbox_message_repository");

    const messageId = message.properties.messageId;
    const message_type = message.properties.type || message.properties.headers.type;
    const handlers = this.signatureTypes[message_type];

    for (const handler of handlers) {
      let retryCount = max_retry_counts;
      const duplicateMessage = await inboxMessageRepository.getInboxMessageExist(messageId, handler.getHandlerName());

      if (duplicateMessage) {
        console.log(
          `INFO Message with id ${messageId} already handled with ${handler.getHandlerName()}. Duplicate message ignored.`
        );
        continue;
      }
      const parsedMessage = this.robustParseMessageContent(message);

      console.log("INFO Handling message with the following parsed content:", parsedMessage);

      const message_obj = {
        messageId: messageId,
        body: parsedMessage,
      };

      let err;

      while (retryCount >= 0) {
        try {
          console.log(`INFO Handling message with messageId: ${messageId} and handler ${handler.getHandlerName()}`);
          await handler.handleEvent(message_obj);
          console.log(`INFO Message ${messageId} handled successfully.`);
          break;
        } catch (error) {
          retryCount--;
          err = error;
        }
      }

      if (retryCount < 0) throw err;
    }
  }
}

exports.messageHandler = new MessageHandler(processors);
