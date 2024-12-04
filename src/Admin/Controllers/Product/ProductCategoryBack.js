const categories = require("../../../Model/Categories");
const users = require("../../../Model/Users");
const HomeController = require("../HomeController");
const ProductAdd = require("./ProductAdd");

module.exports = async (bot, message, admin) => {
  try {
    const userId = message.from.id;

    let categoryId = admin.step.split("#")[2];

    if (categoryId == "all") {
      await users.findOneAndUpdate(
        {
          id: admin?.user_id,
        },
        {
          step: 0,
        }
      );
      await HomeController(bot, message, admin);
      return;
    }

    let category = await categories.findOne({
      id: categoryId,
    });

    let parentCategory;
    if (category.category_id) {
      parentCategory = await categories.findOne({
        id: category.category_id,
      });
    }

    await users.findOneAndUpdate(
      {
        user_id: admin?.user_id,
      },
      {
        step: `product#categories#${parentCategory?.id || "all"}`,
      }
    );

    admin.step = `product#categories#${parentCategory?.id || "all"}`;

    await ProductAdd(bot, message, admin);
  } catch (err) {
    console.log(err + "");
  }
};
