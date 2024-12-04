const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("../config");
const mongo = require("./Model/mongo");
const admin = require("./Admin/admin");
const products = require("./Model/Product");
const MenuController = require("./Controllers/Order/MenuController");
const MessageController = require("./Controllers/MessageController");
const MessageController1 = require("./Admin/Controllers/MessageController");
const CallbackController = require("./Admin/Controllers/CallbackController");
const users = require("./Model/Users");

// Initialize Express app
const app = express();
const bot = new TelegramBot(TOKEN, { polling: true });

// Connect to MongoDB
mongo();

// Middleware to handle incoming requests
app.use(express.json());

// Basic route to check if the server is running
app.get("/healthy", (req, res) => {
  res.status(200).send("<b>Bot is alive🎉🥳</b>");
});

// Function to check user role
const checkUserRole = async (userId) => {
  try {
    const user = await users.findOne({ user_id: userId });
    return user ? user.role : "user"; // Agar foydalanuvchi mavjud bo'lsa, uning rolini qaytarish
  } catch (error) {
    console.error("Error checking user role:", error);
    return "user"; // Xato yuz berганда "user" rolini qaytarish
  }
};

// Telegram bot message handler
bot.on("message", async (message) => {
  try {
    const userId = message.from.id;
    const userRole = await checkUserRole(userId);
    let user = await users.findOne({ user_id: userId });

    // Faqat /start buyruğini qabul qilish
    if (message.text === "/start") {
      if (userRole === "admin") {
        await MessageController1(bot, message, user);
      } else {
        if (!user) {
          user = await users.create({ user_id: userId, step: "go" });
        }

        await bot.sendMessage(
          userId,
          "🌟 Salom! Men **Yanni**, matematik yechimlaringiz uchun yordamchingizman!\n\n" +
            "Matematika bo'yicha savollaringizni berishingiz mumkin, men esa ularni yechishda sizga yordam beraman.\n\n" +
            "Nima savollaringiz bor? Quyidagi mavzular bo'yicha yordam bera olaman:\n" +
            "- Algebra\n" +
            "- Geometriya\n" +
            "- Statistika\n" +
            "- Hisoblash va ko'paytirish\n" +
            "- Matematik masalalar\n\n" +
            "Savollaringizni yozing va men sizga tezda javob beraman! 🤓"
        );
      }
    } else if (user) {
      if (user.step === "go") {
        await MenuController(bot, message, user);
        await MessageController(bot, message, user);
      } else {
        await MessageController1(bot, message, user);
      }
    } else {
      await bot.sendMessage(userId, "Iltimos, /start buyruğini yuboring.");
    }
  } catch (err) {
    console.error("Error in message handler:", err);
  }
});

// Channel post handler
bot.on("channel_post", async (message) => {
  try {
    const data = message?.data;
    const [type, id] = data?.split("#") || [];

    if (type !== "product") return;

    const product = await products.findOne({ id });
    if (product) {
      await products.findOneAndUpdate({ id }, { pic: product.pic }); // Mahsulot rasmiga yangilanish
    }
  } catch (err) {
    console.error("Error in channel_post handler:", err);
  }
});

// Callback query handler
bot.on("callback_query", async (callbackQuery) => {
  try {
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;

    let user = await users.findOne({ user_id: userId });

    switch (data) {
      case "menu":
        await MenuController(bot, callbackQuery, user);
        break;
      case "attribution":
        await CallbackController(bot, callbackQuery, user);
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Execute admin function
// (async () => {
//   await admin();
// })();
