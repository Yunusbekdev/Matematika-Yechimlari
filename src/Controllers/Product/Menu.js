const categories = require("../../Model/Categories");
const products = require("../../Model/Product");
const { Menu } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;

    const categoryList = await categories.find({ category_id: null });
    const productList = await products.find({ category_id: null });

    const keyboard = {
      keyboard: [],
      resize_keyboard: true,
      one_time_keyboard: true,
    };

    if (categoryList.length > 0) {
      keyboard.keyboard.push([
        {
          text: categoryList[0].name,
          callback_data: `category#${categoryList[0].id}`,
        },
      ]);
    }

    const combinedList = [...categoryList, ...productList];

    combinedList.forEach((item) => {
      keyboard.keyboard.push([
        {
          text: item.name,
          callback_data: `${item.price ? "product" : "category"}#${item.id}`,
        },
      ]);
    });

    const messageText = Menu(user.lang);

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
