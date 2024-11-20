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

    for (let i = 0; i < categoryList.length; i += 2) {
      const row = [];

      row.push({
        text: categoryList[i].name,
      });

      if (i + 1 < categoryList.length) {
        row.push({
          text: categoryList[i + 1].name,
        });
      }

      keyboard.keyboard.push(row);
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
    console.error("Error:", error);
  }
};
