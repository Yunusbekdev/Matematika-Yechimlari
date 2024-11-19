const categories = require("../../../Model/Categories");
const products = require("../../../Model/Product");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const data = message.data;
    const messageId = message.message.message_id;

    let type = data.split("#")[0];
    let id = data.split("#")[1];

    if (type !== "category") {
      return;
    }

    let categoryList = await categories.find({
      category_id: id,
    });

    let productList = await products.find({
      category_id: id,
    });

    let items = [...categoryList, ...productList];

    let keyboard = {
      inline_keyboard: [],
    };

    // Group items into pairs for side-by-side buttons
    for (let i = 0; i < items.length; i += 2) {
      const row = [];
      // Add the first button
      row.push({
        text: items[i].name,
        callback_data: `${items[i].price ? "product" : "category"}#${
          items[i].id
        }`,
      });

      // Add the second button if it exists
      if (i + 1 < items.length) {
        row.push({
          text: items[i + 1].name,
          callback_data: `${items[i + 1].price ? "product" : "category"}#${
            items[i + 1].id
          }`,
        });
      }

      keyboard.inline_keyboard.push(row);
    }

    // Add navigation buttons
    keyboard.inline_keyboard.push([
      {
        text: "🔝 Davom etish",
        callback_data: `menu`,
      },
    ]);

    let category = await categories.findOne({
      id,
    });

    let backData = category.category_id
      ? `category#${category.category_id}`
      : `menu`;

    keyboard.inline_keyboard.push([
      {
        text: "⬅️ Ortga",
        callback_data: backData,
      },
    ]);

    await bot.editMessageReplyMarkup(keyboard, {
      chat_id: userId,
      message_id: messageId,
    });
  } catch (err) {
    console.error(err);
  }
};
