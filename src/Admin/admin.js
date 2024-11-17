const TelegramBot = require("node-telegram-bot-api");
const { ADMIN_TOKEN } = require("../../config");
const MessageController = require("./Controllers/MessageController");
const admins = require("../Model/Admins");

module.exports = async function admin() {
  const bot = new TelegramBot(ADMIN_TOKEN, {
    polling: true,
  });

  bot.on("message", async (message) => {
    const userId = message.from.id;
    bot
      .getChatMember(-1001055685828, userId)
      .then((response) => {
        const status = response.status;
        if (status === "left" || status === "kicked") {
          bot.sendMessage(userId, "❌ Foydalanuvchi kanalga obuna bo'lmagan.");
        } else {
          bot.sendMessage(userId, "✅ Foydalanuvchi kanal a'zosi.");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    const admin = await admins.findOne({
      user_id: `${userId}`,
    });
    if (admin) {
      await MessageController(bot, message, admin);
    }
  });
};
