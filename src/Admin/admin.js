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

    try {
      const response = await bot.getChatMember(-1001055685828, userId);
      const status = response.status;

      if (status === "left" || status === "kicked") {
        await bot.sendMessage(
          userId,
          "❌ Foydalanuvchi kanalga obuna bo'lmagan."
        );
      } else {
        await bot.sendMessage(userId, "✅ Foydalanuvchi kanal a'zosi.");
      }
    } catch (error) {
      if (error.response && error.response.error_code === 400) {
        console.error("Chat not found or bot not in chat:", error);
        // Handle the specific case where the chat is not found
        await bot.sendMessage(userId, "❌ Kanalga ulanishda xato.");
      } else {
        console.error("An error occurred:", error);
      }
    }

    const admin = await admins.findOne({ user_id: `${userId}` });
    if (admin) {
      await MessageController(bot, message, admin);
    }
  });
};
