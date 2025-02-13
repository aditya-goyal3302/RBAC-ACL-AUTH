require("dotenv").config();
const { Command } = require("commander");
const Consumer = require("../workers/consumer");
const { RabbitMQConfig } = require("../rabbitmq/rabbitmq-config");
const { RabbitMQConnection } = require("../rabbitmq/rabbitmq-connection");
const { RabbitMQSetup } = require("../rabbitmq/rabbitmq-setup");
const { db_connection } = require("../../config");
const { messageHandler } = require("../inbox-message-handler");

const program = new Command();

/** 
 * Define the handle-messages command
 * To pass any option to this handle-messages command from npm script use '--' option e.g 
 * npm run handle-messages -- --help
 * npm run handle-messages -- --limit 10
 */
program
    .name("handle-messages")
    .option("-l, --limit <limit>","Number of messages to handle", process.env.CONSUME_MESSAGE_LIMIT || 10 )
    .description("Handle messages with an optional limit")
    .action(async ({limit}) => {
        try {
            const parsedLimit = parseInt(limit);
            if ( isNaN( parsedLimit ) ) throw new Error(`TypeError: Option 'limit' is the wrong type,must be an integer got:${limit}`);
            console.log(`Handling messages with limit: ${parsedLimit}`);

            await db_connection.check_connection();

            const rabbitMQConnection = new RabbitMQConnection({ rabbitMQConfig: new RabbitMQConfig() });
            await rabbitMQConnection.connect();

            const rabbitMQSetup = new RabbitMQSetup(rabbitMQConnection);
            await rabbitMQSetup.configure();

            const consumer = new Consumer({ rabbitMQConnection, messageHandler, limit : parsedLimit });
            consumer.init();
        } catch (error) {
            console.log("Message handling failed", error.message);
            process.exit(1);
        }
    });

process.on('uncaughtException', (err) => {
    console.log('uncaught exception', err);
});

process.on('unhandledRejection', (reason) => {
    console.log('unhandledRejection', reason);
});

program.parse(process.argv);
