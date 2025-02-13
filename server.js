require("dotenv").config();
const { createContainer, asClass, asValue } = require("awilix");

class Server {
  constructor({ root_router, error_middleware, parsers, app, cors }) {
    this.app = app;
    this.root_router = root_router;
    this.error_middleware = error_middleware;
    this.parsers = parsers;
    this.cors = cors
  }

  setup_middlewares = () => {
    this.app.use(this.parsers.json_parser());
    this.app.use(this.parsers.cookie_parser());
    this.app.use(this.parsers.url_encoded_parser());
    this.app.use(this.parsers.static());
    this.app.use(...this.parsers.static_path());
    this.app.use(this.cors.cors);
  };

  setup_routes = () => {
    this.app.use(this.root_router.router);
  };

  setup_error_handlers = () => {
    this.app.use(this.error_middleware.handle_error);
    this.app.use(this.error_middleware.handle_not_found);
    this.error_middleware.handle_uncaught_error();
  };

  run_engine = async () => this.app.listen(
    process.env.APP_PORT,
    () => console.log(`\nEngine running \nOn port ${process.env.APP_PORT}`)
  );

}
const container = createContainer();

container.register({
  server: asClass(Server).singleton(),
  app: asValue(require("express")()),
  express: asValue(require("express")),
  ...require("./routes"),
  ...require("./middlewares"),
  ...require("./controllers"),
  ...require("./libs").container,
  ...require("./services"),
  ...require("./repositories"),
});

module.exports = container;
