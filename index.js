// Getting environment variables
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const { resolve: pathResolve } = require("path");

const myEnv = dotenv.config({
  path: pathResolve(__dirname, "./.env"),
});
dotenvExpand.expand(myEnv);

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 8000;

// Imports
const chalk = require("chalk");
const Logger = require("./src/utils/logger");
const { httpServer } = require("./app");

function listenAsync(port, host) {
  return new Promise(function asyncResolve(resolve) {
    httpServer.listen(port, host, function callback() {
      return resolve();
    });
  });
}

listenAsync(PORT, HOST)
  .then(function listening() {
    Logger.info("%s HashFrog Backend is running at http://%s:%d", chalk.green("✓"), HOST, PORT);
    Logger.info("CTRL-C to end the process\n");
    return httpServer;
  })
  .catch(function onError(error) {
    Logger.error("Error", error);
    process.exit(1);
  });

process.on("SIGINT", function exit() {
  Logger.info("Server is exiting...");
  process.exit(0);
});
