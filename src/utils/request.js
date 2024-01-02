const {
  sequelize: { literal },
  Sequelize: { Op },
} = require("../models");

/**
 * Hace un filtro en el modelo por los query-params.
 * Solo si este se encuentra en el modelo.
 * @param {Object} schemaKeys Schema keys from the model.
 * @param {Object} params Query paramameters from the request.
 */
exports.filterByQuery = (schemaKeys, params) => {
  const where = {};
  Object.keys(params).forEach(key => {
    if (!schemaKeys.includes(key)) {
      return;
    }
    let realKey = key;
    let value = params[key];
    if (key.indexOf(".") > -1) {
      realKey = `$${key}$`;
    }
    if (value.indexOf(",") > -1) {
      value = value.split(",");
      where[realKey] = {
        [Op.in]: value,
      };
    } else {
      where[realKey] = value;
    }
  });
  return where;
};

/**
 * Hace un arreglo compatible con el order by de sequelize.
 * Solo usa aquellos que están en el esquema.
 * @example id,desc,name,asc.
 * @param {Object} allowedKeys Llaves del esquema del modelo.
 * @param {String} string Orden del query.
 */
exports.parseOrder = (allowedKeys, string, useLiteral = false) => {
  const params = string.split(",");
  const result = [];
  for (let i = 0; i < params.length; i += 2) {
    const key = params[i];
    if (!allowedKeys.includes(key)) {
      continue;
    }
    const sort = `${params[i + 1]}`.trim();
    if (!sort) {
      break;
    } else if (!["ASC", "DESC"].includes(sort.toUpperCase())) {
      continue;
    }
    result.push([useLiteral ? literal(key.trim()) : key.trim(), sort.trim().toUpperCase()]);
  }
  return result;
};
