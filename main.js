const container = require("./server");

const server = container.resolve("server");
server.run_engine();
