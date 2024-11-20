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

    // Function to add buttons to the keyboard in rows
    const addButtonsToKeyboard = (items) => {
      for (let i = 0; i < items.length; i += 3) {
        const row = [];
        for (let j = 0; j < 3; j++) {
          if (items[i + j]) {
            row.push({
              text: items[i + j].name,
              callback_data: `item#${items[i + j].id}`,
            });
          }
        }
        keyboard.keyboard.push(row);
      }
    };

    // Add categories to keyboard
    if (categoryList.length > 0) {
      addButtonsToKeyboard(categoryList);
    }

    // Add products to keyboard
    if (productList.length > 0) {
      addButtonsToKeyboard(productList);
    }

    // Add additional button for comments
    let msg = startOrderMenu(user);
    let { btns } = msg;

    keyboard.keyboard.push([
      {
        text: btns.comment,
      },
    ]);

    await bot.sendMessage(userId, msg.text, {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.log(err + "");
  }
};
