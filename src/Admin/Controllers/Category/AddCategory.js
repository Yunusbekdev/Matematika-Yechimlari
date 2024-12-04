const users = require("../../../Model/Users");

module.exports = async function (bot, message, admin, categoryId) {
  try {
    const userId = message.from.id;

    await users.findOneAndUpdate(
      {
        user_id: admin?.user_id,
      },
      {
        step: `addCategory#${categoryId}`,
      }
    );

    await bot.sendMessage(userId, "Kategoriya nomni kiriting", {
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
    console.log(err.toString());
  }
};
