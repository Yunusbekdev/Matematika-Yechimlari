const { v4 } = require("uuid");
const admins = require("../../../Model/Admins");
const products = require("../../../Model/Product");

module.exports = async function (bot, message, admin, step) {
  try {
    const userId = message.from.id;
    console.log(step, "categoryId");

    const product = await products.create({
      id: v4(),
      category_id: step !== "undefined" ? step : undefined,
    });

    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: `addProduct#${product.id}#name`,
      }
    );

    await bot.sendMessage(userId, "Mavzu ni nomini kiriting", {
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
    });
  } catch (err) {
    console.log(err + "");
  }
};
