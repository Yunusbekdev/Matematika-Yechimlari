const admins = require("../../Model/Admins");

module.exports = async function (bot, message, admin) {
  try {
    const userId = message.from.id;
    await admins.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        step: 0,
      }
    );

    let keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: "➕ Kategoriyalar",
          },
          {
            text: "📚 Mavzular",
          },
        ],
        [
          {
            text: "👤 Foydalanuvchilari sonni",
          },
        ],
      ],
    };

    await bot.sendMessage(userId, `Quydagilardan birni tanlang!`, {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.log(err + "");
  }
};
