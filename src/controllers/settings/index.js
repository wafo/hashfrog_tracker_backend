"use strict";

const Router = require("koa-router");
const apiRouter = require("./settings.router");

function applyApiMiddleware() {
  const router = new Router({
    prefix: "/settings",
  });

  // Base routes
  // ...

  // Require sub routes
  router.use(apiRouter.routes(), apiRouter.allowedMethods());

  return router;
  // app.use(router.routes()).use(router.allowedMethods());
}

module.exports = applyApiMiddleware;
