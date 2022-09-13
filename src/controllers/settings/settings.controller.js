const hash = require("hash-it");
const axios = require("axios");
const redis = require("../../utils/redis");

async function parseSettingsString(ctx) {
  const { version, settingsString } = ctx.query;
  // Hashing
  const settingsHash = hash({ version, settingsString });
  // Looking for it already in cache
  let inCache = false;
  let settings = await redis.get(`settings_${settingsHash}`);
  if (settings) {
    // Parse the settings
    settings = JSON.parse(settings);
    inCache = true;
  } else {
    // If not in cache, request to ootr.
    const response = await axios.get(`${process.env.OOTR_URL}/settings/get`, {
      params: {
        version,
        settingsString,
      },
    });
    settings = response.data;
    // Store it in cache
    await redis.set(`settings_${settingsHash}`, JSON.stringify(settings), "EX", 604800); // 604800 seconds == 1 week
  }
  return ctx.ok({ inCache, settingsHash, settings });
}

module.exports = {
  parseSettingsString,
};
