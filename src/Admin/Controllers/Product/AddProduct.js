const { v4 } = require("uuid");
const products = require("../../../Model/Product");
const users = require("../../../Model/Users");

module.exports = async function (bot, message, admin, step) {
  try {
    const userId = message.from.id;

    const product = await products.create({
      id: v4(),
      category_id: step !== "undefined" ? step : undefined,
    });

    await users.findOneAndUpdate(
      {
        user_id: admin?.user_id,
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
