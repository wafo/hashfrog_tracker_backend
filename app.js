const http = require("http");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const respond = require("koa-respond");
const Logger = require("koa-logger");
const winLogger = require("./src/utils/logger");
const applyApiMiddleware = require("./src/controllers");

const app = new Koa();

app.on("error", function onError(error) {
  winLogger.error(error);
});

app.use(helmet());

app.use(
  respond({
    statusMethods: {
      conflict: 409,
    },
  }),
);

app.use(
  cors({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "content-type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Access-Control-Allow-Credentials": "true",
  }),
);

app.use(
  bodyParser({
    enableTypes: ["json"],
    jsonLimit: "5mb",
    strict: true,
    onerror: function (err, ctx) {
      return ctx.throw(422, {
        type: "Server/JSONParseError",
        message: "The JSON Body is invalid. Please verify.",
      });
    },
  }),
);

app.use(
  Logger({
    transporter: str => {
      winLogger.info(`${str}`);
    },
  }),
);

applyApiMiddleware(app);

module.exports = {
  httpServer: http.createServer(app.callback()),
  app,
};
