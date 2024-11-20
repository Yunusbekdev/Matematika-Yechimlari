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

    const categoryList = await categories.find({ category_id: null });
    const productList = await products.find({ category_id: null });
    const total = [...categoryList, ...productList];

    const matchedItem = total.find((item) => item.name === text);

    const categoryList1 = await categories.find({ category_id: { $ne: null } });
    const matchedCategory = categoryList1.find(
      (category) => category.name === text
    );

    if (text === "/post" && message.reply_to_message) {
      const admin = await admins.findOne({ user_id: user.user_id });
      if (admin) {
        await ad(
          bot,
          message.reply_to_message.message_id,
          user.user_id,
          message.reply_to_message.reply_markup
        );
      }
      return;
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
        "Ushbu bot haqida takliflaringiz va bot ni misollar bo'yicha murojaatlar yuborishingiz mumkin. (<i>Masalan: Islom Abdujabborov</i>)",
        {
          reply_markup: keyboard,
          parse_mode: "HTML",
        }
      );
      return;
    }

    if (user.step === "go") {
      if (["📊 Kitob yechimlari", "🛒 Заказать", "🛒 Order"].includes(text)) {
        await startOrderController(bot, message, user);
        return;
      }
      if (["🗂 Menu", "🗂 Меню", "Menu"].includes(text)) {
        await Menu(bot, message, user);
        return;
      }
      if (text === "📚 Kitoblar") {
        await OrdersController(bot, message, user);
        return;
      }
    }

    if (matchedItem) {
      const categoryList1 = await categories.find({
        category_id: matchedItem.id,
      });

      if (categoryList1.length > 0) {
        const keyboard = {
          keyboard: [],
          resize_keyboard: true,
          one_time_keyboard: true,
        };

        for (let i = 0; i < categoryList1.length; i += 2) {
          const row = [];

          row.push({
            text: categoryList1[i].name,
          });

          if (categoryList1[i + 1]) {
            row.push({
              text: categoryList1[i + 1].name,
            });
          }

          keyboard.keyboard.push(row);
        }

        keyboard.keyboard.push([
          { text: "⬅️ Ortga" },
          { text: "🔝 Davom etish" },
        ]);

        await bot.sendMessage(userId, "Quyidagilardan birini tanlang", {
          reply_markup: keyboard,
        });
      } else {
        await bot.sendMessage(
          userId,
          "❌ Bunday kategoriya yoki mahsulot topilmadi"
        );
      }
      return;
    } else if (matchedCategory) {
      let keyboard = {
        inline_keyboard: [],
      };

      const categoryList2 = await products.find({
        category_id: matchedCategory.id,
      });

      for (let i = 0; i < categoryList2.length; i += 2) {
        let newRow = [];

        newRow.push({
          text: categoryList2[i].name,
          callback_data: `product#${categoryList2[i].id}`, // Removed price related part
        });

        if (categoryList2[i + 1]) {
          newRow.push({
            text: categoryList2[i + 1].name,
            callback_data: `product#${categoryList2[i + 1].id}`, // Removed price related part
          });
        }

        keyboard.inline_keyboard.push(newRow);
      }

      await bot.sendMessage(userId, `Quyidagi rasimlardan birini tanlang👇`, {
        reply_markup: keyboard,
        parse_mode: "HTML",
      });
    }
  } catch (e) {
    console.error("Error:", e);
    await bot.sendMessage(
      userId,
      "A technical error occurred. Please try again later."
    );
  }
};
