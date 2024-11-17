const admins = require("../../../Model/Admins");
const products = require("../../../Model/Product");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
    const text = message.text;
    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `addProduct#${productId}#pic`,
      }
    );

    await products.findOneAndUpdate(
      {
        id: productId,
      },
      {
        description: text,
      }
    );

    await bot.sendMessage(userId, "Misollarni javoblarini rasimni yuboring", {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: "⬅️ Ortga",
            },
          ],
        ],
      },
      parse_mode: "HTML",
    });
  } catch (err) {
    console.log(err + "");
  }
};
