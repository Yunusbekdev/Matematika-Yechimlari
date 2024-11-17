const categories = require("../../../Model/Categories");

module.exports = async function (bot, message, admin, categoryId) {
  try {
    const userId = message.from.id;

    let categoryList = [];
    if (categoryId) {
      categoryList = await categories.find({
        categoryId,
      });
    } else {
      categoryList = await categories.find();
    }

    let keyboard = {
      resize_keyboard: true,
      keyboard: [
        [
          {
            text: "➕ Qo'shish",
          },
        ],
      ],
    };

    for (let category of categoryList) {
      keyboard.keyboard.push([
        {
          text: category.name,
        },
      ]);
    }

    keyboard.keyboard.push([
      {
        text: "⬅️ Ortga",
      },
    ]);

    await bot.sendMessage(
      userId,
      `Qaysi kategoriyani ichiga mahsulot qo'shmoqchisiz`,
      {
        reply_markup: keyboard,
      }
    );
  } catch (error) {
    console.log(error + "");
  }
};
