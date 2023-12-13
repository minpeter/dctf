const mustache = require("mustache");
const config = require("../../config");

module.exports = function (source) {
  return mustache.render(source, {
    jsonConfig: JSON.stringify(config),
    config,
  });
};
