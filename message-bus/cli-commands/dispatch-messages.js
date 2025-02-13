require("dotenv").config();
const { Command } = require("commander");
const { RabbitMQConfig } = require("../rabbitmq/rabbitmq-config");
const { RabbitMQConnection } = require("../rabbitmq/rabbitmq-connection");
const { RabbitMQSetup } = require("../rabbitmq/rabbitmq-setup");
const OutboxMessageRelay = require("../outbox-message-relay");
const { db_connection } = require("../../config");
const Producer = require("../workers/producer");
const outboxMessageRepository = require("../../server").resolve("outbox_message_repository");

const program = new Command();

/**
 * Define the dispatch-messages command
 * To pass any option to this dispatch command from npm script use '--' option e.g
 * npm run dispatch-messages -- --help
 * npm run dispatch-messages -- --limit 10
 */
program
  .name("dispatch-messages")
  .option("-l, --limit <limit>", "Number of messages to dispatch", process.env.DISPATCH_MESSAGE_LIMIT || 10)
  .description("Dispatch messages with an optional limit")
  .action(async ({ limit }) => {
    try {
      const parsedLimit = parseInt(limit);
      if (isNaN(parsedLimit))
        throw new Error(`TypeError: Option 'limit' is the wrong type,must be an integer got:${limit}`);
      console.log(`Dispatching messages with limit: ${parsedLimit}`);

      await db_connection.check_connection();

      const rabbitMQConnection = new RabbitMQConnection({
        rabbitMQConfig: new RabbitMQConfig(),
        reconnectPolicy: true,
      });
      await rabbitMQConnection.connect();

      const rabbitMQSetup = new RabbitMQSetup(rabbitMQConnection);
      await rabbitMQSetup.configure();

    // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      // await sleep(5000);
      const outboxMessageRelay = new OutboxMessageRelay({
        producer: new Producer({ rabbitMQConnection, rabbitMQSetup }),
        outboxMessageRepository,
      });
      await outboxMessageRelay._execute(parsedLimit);

      process.exit(0);
    } catch (error) {
        console.log('error: ', error);
      console.log("Error occurred during message dispatch: ", error.message);
      process.exit(1);
    }
  });

process.on("uncaughtException", (err) => {
  console.log("uncaught exception", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("unhandledRejection", reason);
});

program.parse(process.argv);
