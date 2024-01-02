"use strict";

const Router = require("koa-router");
const yup = require("yup");

const onErrorMiddleware = require("../../middleware/onError.middleware");
const validateMiddleware = require("../../middleware/validate.middleware");
const controller = require("./settings.controller");

const router = new Router();

router.use(onErrorMiddleware);

router.get(
  "/string",
  validateMiddleware({
    query: {
      version: yup.string().trim().required(),
      settingsString: yup.string().trim().required(),
    },
  }),
  controller.parseSettingsString,
);

module.exports = router;
