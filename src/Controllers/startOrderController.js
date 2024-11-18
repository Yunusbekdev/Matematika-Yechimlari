const categories = require("../Model/Categories");
const products = require("../Model/Product");
const { startOrderMenu } = require("./Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;

    // Fetch categories and products
    let categoryList = await categories.find({ category_id: null });
    let productList = await products.find({ category_id: null });

    // Initialize the keyboard
    let keyboard = {
      resize_keyboard: true,
      keyboard: [],
    };

    // Add categories to the keyboard side by side
    if (categoryList.length > 0) {
      const categoryRow = categoryList.map((category) => ({
        text: category.name,
        callback_data: `category#${category.id}`,
      }));
      keyboard.keyboard.push(categoryRow);
    }

    // Add products to the keyboard
    if (productList.length > 0) {
      const productRow = productList.map((product) => ({
        text: product.name,
        callback_data: `product#${product.id}`,
      }));
      keyboard.keyboard.push(productRow);
    }

    // Add additional buttons from startOrderMenu
    let msg = startOrderMenu(user);
    let { btns } = msg;

    // Add order menu buttons
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
