const categories = require("../../Model/Categories");
const products = require("../../Model/Product");
const { Menu } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;

    // Fetch categories and products
    const categoryList = await categories.find({ category_id: null });
    const productList = await products.find({ category_id: null });

    // Initialize the keyboard structure
    const keyboard = {
      keyboard: [],
      resize_keyboard: true,
      one_time_keyboard: true,
    };

    // Add first category to the keyboard if available
    if (categoryList.length > 0) {
      keyboard.keyboard.push([
        {
          text: categoryList[0].name,
          callback_data: `category#${categoryList[0].id}`,
        },
      ]);
    }

    // Combine categories and products
    const combinedList = [...categoryList, ...productList];

    // Create buttons for categories and products
    combinedList.forEach((item) => {
      keyboard.keyboard.push([
        {
          text: item.name,
          callback_data: `${item.price ? "product" : "category"}#${item.id}`,
        },
      ]);
    });

    const messageText = Menu(user.lang);

    // Send the message with the keyboard
    await bot.sendMessage(
      userId,
      messageText || "Quyidagi kategoriyalardan birini tanlang!",
      {
        reply_markup: keyboard,
        parse_mode: "HTML",
      }
    );
  } catch (err) {
    console.error("Error:", err);
    await bot.sendMessage(
      userId,
      "A technical error occurred. Please try again later."
    );
  }
};
