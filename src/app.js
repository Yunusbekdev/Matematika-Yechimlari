const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("../config");
const users = require("./Model/Users");
const mongo = require("./Model/mongo");
const admin = require("./Admin/admin");
const products = require("./Model/Product");
const Menu = require("./Controllers/Product/Menu");
const CallbackController = require("./Admin/Controllers/CallbackController");
const MenuController = require("./Controllers/Order/MenuController");
const MessageController = require("./Controllers/MessageController");

const bot = new TelegramBot(TOKEN, { polling: true });

mongo();

bot.on("message", async (message) => {
  try {
    let userId = message.from.id;

    let user = await users.findOne({ user_id: userId });

    if (message.text === "/start") {
      if (!user) {
        user = await users.create({ user_id: userId, step: "go" });
      }

      await MenuController(bot, message, user);

      await bot.sendMessage(
        userId,
        "🌟 Salom! Men **Yanni**, matematik yechimlaringiz uchun yordamchingizman!\n\n" +
          "Matematika bo'yicha savollaringizni berishingiz mumkin, men esa ularni yechishda sizga yordam beraman.\n\n" +
          "Nima savollaringiz bor? Quyidagi mavzular bo'yicha yordam bera olaman:\n" +
          "- **Algebra**\n" +
          "- **Geometriya**\n" +
          "- **Statistika**\n" +
          "- **Hisoblash va ko'paytirish**\n" +
          "- **Matematik masalalar**\n\n" +
          "Savollaringizni yozing va men sizga tezda javob beraman! 🤓"
      );
    } else if (user.step == "go") {
      await MenuController(bot, message, user);
      await MessageController(bot, message, user);
    } else {
      await MenuController(bot, message, user);
      await MessageController(bot, message, user);
    }
  } catch (err) {
    console.error("Error in message handler:", err);
  }
});

bot.on("channel_post", async (message) => {
  try {
    const data = message?.data;
    const [type, id] = data?.split("#") || [];

    if (type !== "product") return;

    const product = await products.findOne({ id });
    if (product) {
      await products.findOneAndUpdate({ pic: product.pic });
    }
  } catch (err) {
    console.error("Error in channel_post handler:", err);
  }
});

bot.on("callback_query", async (callbackQuery) => {
  try {
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;

    let user = await users.findOne({ user_id: userId });

    switch (data) {
      case "menu":
        await Menu(bot, callbackQuery, user);
        break;
      case "attribution":
        await AttributionController(bot, callbackQuery, user);
        break;
      case "kitob1":
        await bot.sendDocument(
          userId,
          "BQACAgIAAyEFAASQ70ZJAAMFZzIs_Nk8icuPDE5-pMbbIAoggVoAApUiAAKNnVhJawbyUp-ynlg2BA"
        );
        break;
      case "kitob2":
        await bot.sendDocument(
          userId,
          "BQACAgIAAxkBAAIC9mcyNBxgzwqs9-WFBNOCCA7CtXH-AAJfBgACy2zBSFmoWEcRaswMNgQ"
        );
        break;
      case "kitob3":
        await bot.sendDocument(
          userId,
          "BQACAgIAAxkBAAIDBmcyNkiww132kbbPc0rXfqM_P1sgAAKkCwAClalIS5iB0WwNPiqXNgQ"
        );
        break;
      default:
        await CallbackController(bot, callbackQuery, user);
        break;
    }

    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (err) {
    console.error("Error in callback_query handler:", err);
  }
});

(async () => {
  await admin();
})();
