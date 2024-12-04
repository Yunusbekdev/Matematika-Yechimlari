const products = require("../../../Model/Product");
const HomeController = require("../HomeController");
const users = require("../../../Model/Users");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
    await products.deleteOne({
      id: productId,
    });
    await users.findOneAndUpdate(
      {
        user_id: admin?.user_id,
      },
      {
        step: 0,
      }
    );
    await bot.sendMessage(userId, `Javob lar qo'shish bekor qilindi`);
    await HomeController(bot, message, admin);
  } catch (err) {
    console.log(err + "");
  }
};
