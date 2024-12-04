const categories = require("../Model/Categories");
const products = require("../Model/Product");
const { startOrderMenu } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;

    let categoryList = await categories.find({ category_id: null });
    let productList = await products.find({ category_id: null });

    let keyboard = {
      resize_keyboard: true,
      keyboard: [],
    };

    const addButtonsToKeyboard = (items) => {
      for (let i = 0; i < items.length; i += 3) {
        const row = [];
        for (let j = 0; j < 3; j++) {
          if (items[i + j]) {
            if (items[i + j].name) {
              row.push({
                text: items[i + j].name,
              });
            } else {
              console.warn(
                `Item at index ${i + j} does not have a 'name' property.`
              );
            }
          }
        }
        if (row.length > 0) {
          keyboard.keyboard.push(row);
        }
      }
    };

    if (categoryList.length > 0) {
      addButtonsToKeyboard(categoryList);
    } else {
      console.warn("No categories found.");
    }

    if (productList.length > 0) {
      addButtonsToKeyboard(productList);
    } else {
      console.warn("No products found.");
    }

    let msg = startOrderMenu(user);
    let { btns } = msg;

    if (!btns.comment) {
      console.error("btns.comment is not defined.");
      return;
    }

    keyboard.keyboard.push([
      {
        text: btns.comment,
      },
    ]);

    await bot.sendMessage(userId, msg.text, {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error("Error:", err);
  }
};
