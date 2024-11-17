const categories = require("../../Model/Categories");
const products = require("../../Model/Product");
const { Menu } = require("../Texts");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    let categoryList = await categories.find({ category_id: null });
    let productList = await products.find({ category_id: null });

    let keyboard = {
      keyboard: [
        [
          {
            text: "Barcha menyular",
            url: "https://telegra.ph/Dostlik-Burger-11-03",
          },
        ],
      ],
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

    let total = [...categoryList, ...productList];

    for (let i = 0; i < total.length; i++) {
      keyboard.keyboard.push([
        {
          text: total[i].name,
          callback_data: `${total[i].price ? "product" : "category"}#${
            total[i].id
          }`,
        },
      ]);
    }

    let text = Menu(user.lang);

    await bot.sendMessage(
      userId,
      `${text},Quydagi kategoriyalardan birini tanlang!`,
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
