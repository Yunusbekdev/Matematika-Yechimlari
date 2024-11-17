const admins = require("../../../Model/Admins");
const HomeController = require("../HomeController");

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

    await HomeController(bot, message, admin);
  } catch (err) {
    console.log(err + "");
  }
};
