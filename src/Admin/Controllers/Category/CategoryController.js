const admins = require("../../../Model/Admins");
const categories = require("../../../Model/Categories");

module.exports = async function (bot, message, admin, category_id) {
  try {
    const userId = message.from.id;
    let categoryList = [];

    // Fetch categories based on the provided category_id
    if (category_id) {
      categoryList = await categories.find({ category_id: category_id });
    } else {
      categoryList = await categories.find({ category_id: { $eq: null } });
    }

    // Initialize the keyboard with the "Add" button
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

    // Prepare rows of categories, with up to 3 buttons per row
    for (let i = 0; i < categoryList.length; i++) {
      // Create a new row if necessary
      if (i % 3 === 0) {
        keyboard.keyboard.push([]);
      }

      // Add category button to the current row
      keyboard.keyboard[keyboard.keyboard.length - 1].push({
        text: categoryList[i].name,
      });
    }

    // Add a back button
    keyboard.keyboard.push([
      {
        text: "⬅️ Ortga",
      },
    ]);

    // Add a delete button if category_id is provided
    if (category_id) {
      keyboard.keyboard[keyboard.keyboard.length - 1].push({
        text: "🗑 O'chirish",
      });
    }

    // Send the message with categories
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
