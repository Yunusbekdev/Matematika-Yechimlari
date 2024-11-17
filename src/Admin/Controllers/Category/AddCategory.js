const admins = require("../../../Model/Admins");

module.exports = async function (bot, message, admin, categoryId) {
  try {
    const userId = message.from.id;

    await admins.findOneAndUpdate(
      {
        user_id: userId,
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
