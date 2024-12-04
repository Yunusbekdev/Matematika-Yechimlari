const ad = require("../Admin/addPost");
const OrdersController = require("./Orders/OrdersController");
const startOrderController = require("./startOrderController");
const categories = require("../Model/Categories");
const products = require("../Model/Product");
const users = require("../Model/Users");

module.exports = async function (bot, message, user) {
  let userId;

  try {
    userId = message.from.id;
    const userText = message.text;

    const [topLevelCategories, topLevelProducts] = await Promise.all([
      categories.find({ category_id: null }),
      products.find({ category_id: null }),
    ]);
    const allItems = [...topLevelCategories, ...topLevelProducts];

    const matchedItem = allItems.find((item) => item.name === userText);

    const matchedCategory = await categories.findOne({
      name: userText,
      category_id: { $ne: null },
    });

    if (userText === "/post" && message.reply_to_message) {
      const admin = await users.findOne({ user_id: user.user_id });
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

    if (
      ["✍️ Fikr bildirish", "✍️ Обратная связь", "✍️ Leave comment"].includes(
        userText
      ) &&
      user.step === "go"
    ) {
      const feedbackKeyboard = {
        inline_keyboard: [
          [{ text: "✍️ Murojaat yozish", url: "https://t.me/SAYIDATIY" }],
        ],
      };
      await bot.sendMessage(
        userId,
        "Ushbu bot haqida takliflaringiz va bot ni misollar bo'yicha murojaatlar yuborishingiz mumkin. (<i>Masalan: Islom Abdujabborov</i>)",
        { reply_markup: feedbackKeyboard, parse_mode: "HTML" }
      );
      return;
    }

    if (user.step === "go") {
      if (
        ["📊 Kitob yechimlari", "🛒 Заказать", "🛒 Order"].includes(userText)
      ) {
        await startOrderController(bot, message, user);
        return;
      }
      if (userText === "📚 Kitoblar") {
        await OrdersController(bot, message, user);
        return;
      }
    }

    if (matchedCategory) {
      const subcategories = await categories.find({
        category_id: matchedCategory.id,
      });

      const productsInCategory = await products.find({
        category_id: matchedCategory.id,
      });

      if (subcategories.length) {
        const subcategoryKeyboard = {
          keyboard: [],
          resize_keyboard: true,
          one_time_keyboard: true,
        };

        for (let i = 0; i < subcategories.length; i += 3) {
          const subcategoryRow = [];
          for (let j = 0; j < 3; j++) {
            if (i + j < subcategories.length) {
              subcategoryRow.push({
                text: subcategories[i + j].name,
                callback_data: `subcategory#${subcategories[i + j].id}`,
              });
            }
          }
          subcategoryKeyboard.keyboard.push(subcategoryRow);
        }

        subcategoryKeyboard.keyboard.push([
          {
            text: "⬅️ Ortga",
            callback_data: `category#${matchedCategory.category_id}`,
          },
        ]);

        await bot.sendMessage(userId, "Quyidagilardan birini tanlang:", {
          reply_markup: subcategoryKeyboard,
          parse_mode: "HTML",
        });
      } else if (productsInCategory.length > 0) {
        const productKeyboard = {
          inline_keyboard: [],
        };

        for (let i = 0; i < productsInCategory.length; i += 2) {
          const productRow = [];

          if (productsInCategory[i] && productsInCategory[i].name) {
            productRow.push({
              text: productsInCategory[i].name || "No Name", // Zaxira qiymati
              callback_data: `product#${productsInCategory[i].id}`,
            });
          } else {
            console.warn(`Missing name for product at index ${i}`);
          }

          if (productsInCategory[i + 1] && productsInCategory[i + 1].name) {
            productRow.push({
              text: productsInCategory[i + 1].name || "No Name", // Zaxira qiymati
              callback_data: `product#${productsInCategory[i + 1].id}`,
            });
          }

          if (productRow.length > 0) {
            productKeyboard.inline_keyboard.push(productRow);
          }
        }

        await bot.sendMessage(
          userId,
          "Quyidagi mahsulotlardan birini tanlang👇",
          {
            reply_markup: productKeyboard,
            parse_mode: "HTML",
          }
        );
      }
    }

    if (matchedItem) {
      const matchedCategoryDetails = await categories.findOne({
        id: matchedItem.id,
      });

      if (matchedCategoryDetails) {
        const subcategories = await categories.find({
          category_id: matchedCategoryDetails.id,
        });

        if (subcategories.length > 0) {
          const subcategoryKeyboard = {
            keyboard: [],
            resize_keyboard: true,
            one_time_keyboard: true,
          };

          for (let i = 0; i < subcategories.length; i += 3) {
            const row = [];
            for (let j = 0; j < 3; j++) {
              if (i + j < subcategories.length) {
                row.push({
                  text: subcategories[i + j].name,
                  callback_data: `subcategory#${subcategories[i + j].id}`,
                });
              }
            }
            subcategoryKeyboard.keyboard.push(row);
          }

          subcategoryKeyboard.keyboard.push([
            {
              text: "⬅️ Ortga",
              callback_data: `category#${matchedCategoryDetails.category_id}`,
            },
          ]);

          await bot.sendMessage(userId, "Quyidagilardan birini tanlang:", {
            reply_markup: subcategoryKeyboard,
            parse_mode: "HTML",
          });
        } else {
          await bot.sendMessage(
            userId,
            "❌ Bu kategoriyada subkategoriya yo'q."
          );
        }
      } else {
        await bot.sendMessage(userId, "❌ Bunday kategoriya topilmadi.");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    await bot.sendMessage(
      userId,
      "A technical error occurred. Please try again later."
    );
  }
};
