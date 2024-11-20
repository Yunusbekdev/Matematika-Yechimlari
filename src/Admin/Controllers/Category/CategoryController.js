const admins = require("../../../Model/Admins");
const categories = require("../../../Model/Categories");

module.exports = async function (bot, message, admin, category_id) {
  try {
    const userId = message.from.id;
    const text = message.text;
    let categoryList = [];

    // Fetch categories based on category_id
    if (category_id) {
      categoryList = await categories.find({ category_id: category_id });
    } else {
      categoryList = await categories.find({
        category_id: { $eq: null },
      });
    }

    // Initialize the keyboard
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

    // Add categories to the keyboard, grouping them into pairs
    for (let i = 0; i < categoryList.length; i += 2) {
      const row = [];

      // Add the first category button
      row.push({
        text: categoryList[i].name,
      });

      // Add the second category button if it exists
      if (i + 1 < categoryList.length) {
        row.push({
          text: categoryList[i + 1].name,
        });
      }

      keyboard.keyboard.push(row);
    }

    // Add the back button
    keyboard.keyboard.push([
      {
        text: "⬅️ Ortga",
      },
    ]);

    // If category_id is provided, add the delete button
    if (category_id) {
      keyboard.keyboard[keyboard.keyboard.length - 1].push({
        text: "🗑 O'chirish",
      });
    }

    // Send the message with the keyboard
    if (categoryList.length > 0) {
      await bot.sendMessage(
        userId,
        `Quydagi kategoriyalardan birini tanlang!`,
        {
          reply_markup: keyboard,
        }
      );
    } else {
      await bot.sendMessage(userId, `Malumot topilmadi`, {
        reply_markup: keyboard,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
