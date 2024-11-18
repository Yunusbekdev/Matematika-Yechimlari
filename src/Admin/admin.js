const TelegramBot = require("node-telegram-bot-api");
const { ADMIN_TOKEN } = require("../../config");
const MessageController = require("./Controllers/MessageController");
const admins = require("../Model/Admins");

module.exports = async function admin()   {
  const bot = new TelegramBot(ADMIN_TOKEN, {
    polling: true,
  });

  bot.on("message", async (message) => {
    const userId = message.from.id;

    const admin = await admins.findOne({ user_id: `${userId}` });
    if (admin) {
      await MessageController(bot, message, admin);
    }
  });
};
