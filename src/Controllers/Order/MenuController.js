const { MenuMsg } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;

    const menuMsg = MenuMsg(user.lang);

    if (!menuMsg || !menuMsg.keyboard) {
      console.error("MenuMsg returned an undefined structure:", menuMsg);
      return await bot.sendMessage(
        userId,
        "Menu not available at the moment. Please try again later."
      );
    }

    const keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: menuMsg.keyboard.order,
          },
          {
            text: menuMsg.keyboard.orders,
          },
        ],
        [
          {
            text: menuMsg.keyboard.comment,
          },
        ],
      ],
    };

    await bot.sendMessage(userId, menuMsg.text, {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error("Error in sending menu message:", err.toString());
  }
};
