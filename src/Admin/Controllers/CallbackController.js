const MenuProduct = require("../../Controllers/Product/MenuProduct");
const MenuCategory = require("./Category/MenuCategory");

module.exports = async function (bot, message, user) {
  try {
    await Promise.all([
      MenuCategory(bot, message, user),
      MenuProduct(bot, message, user),
    ]);
  } catch (err) {
    console.log(err + "");
  }
};
