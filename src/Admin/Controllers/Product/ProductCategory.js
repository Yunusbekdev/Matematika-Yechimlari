const admins = require("../../../Model/Admins");
const categories = require("../../../Model/Categories");

module.exports = async function (bot, message, admin) {
  try {
    const userId = message.from.id;
    const text = message.text;

    let categoryId = admin.step.split("#")[2];
    categoryId = categoryId === "all" ? undefined : categoryId;

    let category = await categories.findOne({
      name: text,
    });

    if (category !== null) {
      await admins.findOneAndUpdate(
        {
          user_id: userId,
        },
        {
          step: `product#categories#${category.id}`,
        }
      );

      let categoryList = await categories.find({
        category_id: category.id,
      });

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
        let newRow = [];
        newRow.push({ text: categoryList[i].name });
        if (categoryList[i + 1]) {
          newRow.push({ text: categoryList[i + 1].name });
        }
      }
      keyboard.keyboard.push([
        {
          text: "⬅️ Ortga",
        },
      ]);

      await bot.sendMessage(userId, category.name, {
        reply_markup: keyboard,
      });
    }
  } catch (err) {
    console.log(err + "");
  }
};
