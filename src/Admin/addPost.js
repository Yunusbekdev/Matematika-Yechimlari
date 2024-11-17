const users = require("../Model/Users");

module.exports = async function (bot, messageId, chatId, markup) {
  try {
    let usersList = await users.find();

    let interval = 1000 / 15;

    for (let user of usersList) {
      setTimeout(async function () {
        try {
          await bot.copyMessage(user.user_id, chatId, messageId, {
            reply_markup: markup,
          });
        } catch (err) {
          console.log(err + "");
        }
      }, interval);
    }
  } catch (err) {
    console.log(err + "");
  }
};
