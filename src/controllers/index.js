"use strict";

const fs = require("fs");
const path = require("path");
const Router = require("koa-router");

const baseName = path.basename(__filename);

function applyApiMiddleware(app) {
  const router = new Router();

  // Base routes
  router.get("/", function mainGet(ctx) {
    ctx.ok({
      name: "HashFrog Backend",
      version: process.env.API_VERSION || "NA",
    });
  });

  // Loading routers from all controllers
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf(".") !== 0 && file !== baseName)
    .forEach(file => {
      const api = require(path.join(__dirname, file))(Router);
      router.use(api.routes());
    });

  app.use(router.routes()).use(router.allowedMethods());
}

module.exports = applyApiMiddleware;
