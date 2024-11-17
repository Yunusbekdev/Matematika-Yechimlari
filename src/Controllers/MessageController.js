const ad = require("../Admin/addPost");
const admins = require("../Model/Admins");
const Menu = require("./Product/Menu");
const OrdersController = require("./Orders/OrdersController");
const startOrderController = require("./startOrderController");
const categories = require("../Model/Categories");
const products = require("../Model/Product");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const text = message.text;

    // Fetch the list of categories and products without a parent category
    let categoryList = await categories.find({ category_id: null });
    let productList = await products.find({ category_id: null });

    let total = [...categoryList, ...productList];

    // Find the matched item based on user input
    const matchedItem = total.find((item) => item.name === text);

    // Handle post command
    if (text === "/post") {
      if (message.reply_to_message) {
        const admin = await admins.findOne({ user_id: user.user_id });
        if (admin) {
          await ad(
            bot,
            message.reply_to_message.message_id,
            user.user_id,
            message.reply_to_message.reply_markup
          );
        }
      }
    }

    // Handle feedback request
    if (
      ["✍️ Fikr bildirish", "✍️ Обратная связь", "✍️ Leave comment"].includes(
        text
      ) &&
      user.step === "go"
    ) {
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "✍️ Murojaat yozish",
              url: "https://t.me/SAYIDATIY",
            },
          ],
        ],
      };
      await bot.sendMessage(
        userId,
        `Ushbu bot haqida takliflaringiz va bot ni misollar bo'yicha murojaatlar yuborishingiz mumkin. (<i>Masalan: Islom Abdujabborov</i>)`,
        {
          reply_markup: keyboard,
          parse_mode: "HTML",
        }
      );
    } else if (
      user.step === "go" &&
      (text === "📊 Kitob yechimlari" ||
        text === "🛒 Заказать" ||
        text === "🛒 Order")
    ) {
      await startOrderController(bot, message, user);
    } else if (["🗂 Menu", "🗂 Меню", "Menu"].includes(text)) {
      await Menu(bot, message, user);
    } else if (user.step === "go" && text === "📚 Kitoblar") {
      await OrdersController(bot, message, user);
    } else if (matchedItem) {
      let categoryList1 = await categories.find({
        category_id: matchedItem.id,
      });

      console.log(categoryList1, 999); // Log the filtered categories

      if (categoryList1.length > 0) {
        // Create the keyboard with subcategories and additional buttons
        const keyboard = {
          keyboard: [
            ...categoryList1.map((category) => [
              {
                text: category.name,
              },
            ]),
            [
              {
                text: "⬅️ Ortga", // Back button
              },
              {
                text: "🔝 Davom etish", // Continue button
              },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        };

        await bot.sendMessage(userId, "Quyidagilardan birini tanlang", {
          reply_markup: keyboard,
        });
      } else {
        await bot.sendMessage(userId, "❌ Bunday kategoriya topilmadi");
      }
    }
  } catch (e) {
    console.error("Error:", e);
    await bot.sendMessage(
      userId,
      "A technical error occurred. Please try again later."
    );
  }
};
