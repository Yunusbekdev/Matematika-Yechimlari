const users = require("../../../Model/Users");
const HomeController = require("../HomeController");

module.exports = async function (bot, message, admin) {
  try {
    const userId = message.from.id;

    await users.findOneAndUpdate(
      {
        user_id: admin?.user_id,
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
