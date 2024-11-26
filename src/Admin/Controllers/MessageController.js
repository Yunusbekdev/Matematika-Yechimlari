const admins = require("../../Model/Admins");
const categories = require("../../Model/Categories");
const AddCategory = require("./Category/AddCategory");
const AddProduct = require("./Product/AddProduct");
const CategoryController = require("./Category/CategoryController");
const DeleteProduct = require("./Product/DeleteProduct");
const HomeController = require("./HomeController");
const ProductAdd = require("./Product/ProductAdd");
const ProductCategoryBack = require("./Product/ProductCategoryBack");
const ProductCategory = require("./Product/ProductCategory");
const ProductImg = require("./Product/ProductImg");
const ProductSaveController = require("./Product/ProductSaveController");
const ProductUpdateName = require("./Product/ProductUpdateName");
const SaveCategory = require("./Category/SaveCategory");
const UsersCount = require("./UsersCount");
const products = require("../../Model/Product");

module.exports = async function (bot, message, admin) {
  try {
    const userId = message.from.id;
    const text = message.text;
    console.log(text, 55);

    const [topLevelCategories, topLevelProducts] = await Promise.all([
      categories.find({ category_id: null }),
      products.find({ category_id: null }),
    ]);
    const allItems = [...topLevelCategories, ...topLevelProducts];

    // Match user input with categories or products
    const matchedItem = allItems.find((item) => item.name === text);
    const matchedCategory = await categories.findOne({
      name: text,
      category_id: { $ne: null },
    });

    // Start command
    if (text === "/start") {
      await HomeController(bot, message, admin);
    }
    // Categories menu
    else if (admin.step === "0" && text === "➕ Kategoriyalar") {
      await admins.findOneAndUpdate(
        { user_id: userId },
        { step: `categories#all` }
      );
      await CategoryController(bot, message, admin);
    }
    // Category handling
    else if (admin.step?.split("#")[0] === "categories") {
      if (text === "➕ Qo'shish") {
        let categoryId =
          admin.step?.split("#")[1] === "all"
            ? undefined
            : admin.step?.split("#")[1];
        await AddCategory(bot, message, admin, categoryId);
      } else if (text === "⬅️ Ortga") {
        let stepId = admin.step?.split("#")[1];
        let category = await categories.findOne({ id: stepId });
        if (stepId === "all") {
          await admins.findOneAndUpdate({ user_id: userId }, { step: "0" });
          await HomeController(bot, message, admin);
          await CategoryController(bot, message, admin, category.id);
          return;
        }
        await admins.findOneAndUpdate(
          { user_id: userId },
          { step: `categories#${category?.category_id || "all"}` }
        );
        await CategoryController(bot, message, admin, category?.category_id);
      } else if (text === "🗑 O'chirish") {
        let stepId = admin.step.split("#")[1];
        await categories.deleteOne({ id: stepId });
        await admins.findOneAndUpdate(
          { user_id: userId },
          { step: `categories#${category?.category_id || "all"}` }
        );
        await CategoryController(bot, message, admin, category?.category_id);
      } else {
        let category = await categories.findOne({ name: text });
        if (category) {
          await admins.findOneAndUpdate(
            { user_id: userId },
            { step: `categories#${category.id}` }
          );
          await CategoryController(bot, message, admin, category.id);
        }
      }
    }
    // Adding a category
    else if (admin.step?.split("#")[0] === "addCategory") {
      let categoryId =
        admin.step?.split("#")[1] === "all"
          ? undefined
          : admin.step?.split("#")[1];
      await SaveCategory(bot, message, admin, categoryId);
    }
    // Product handling
    else if (admin.step === "0" && text === "📚 Mavzular") {
      await admins.findOneAndUpdate(
        { user_id: userId },
        { step: `product#categories#all` }
      );
      await ProductAdd(bot, message, admin);
    }
    // Product category selection
    else if (admin.step?.split("#")[0] === "product") {
      if (matchedCategory) {
        const subcategories = await categories.find({
          category_id: matchedCategory.id,
        });

        const productsInCategory = await products.find({
          category_id: matchedCategory.id,
        });

        // Update the admin's step to reflect the current category context
        await admins.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: `product#categories#${matchedCategory.id}`, // Use matchedCategory.id
          }
        );

        if (subcategories.length) {
          const subcategoryKeyboard = {
            keyboard: [],
            resize_keyboard: true,
            one_time_keyboard: true,
          };

          for (let i = 0; i < subcategories.length; i += 3) {
            const subcategoryRow = [];
            for (let j = 0; j < 3; j++) {
              if (i + j < subcategories.length) {
                subcategoryRow.push({
                  text: subcategories[i + j].name,
                  callback_data: `subcategory#${subcategories[i + j].id}`,
                });
              }
            }
            subcategoryKeyboard.keyboard.push(subcategoryRow);
          }

          subcategoryKeyboard.keyboard.push([
            {
              text: "⬅️ Ortga",
              callback_data: `category#${matchedCategory.category_id}`,
            },
          ]);

          await bot.sendMessage(userId, "Quyidagilardan birini tanlang:", {
            reply_markup: subcategoryKeyboard,
            parse_mode: "HTML",
          });
        } else {
          // If there are no subcategories, show products
          let keyboard = {
            resize_keyboard: true,
            keyboard: [
              [
                {
                  text: "➕ Qo'shish",
                },
              ],
              [
                {
                  text: "⬅️ Ortga",
                },
              ],
            ],
          };

          await bot.sendMessage(
            userId,
            "Qaysi kategoriyani ichiga mahsulot qo'shmoqchisiz?",
            {
              reply_markup: keyboard,
              parse_mode: "HTML",
            }
          );
        }
      }

      // Handle matched item (product)
      if (matchedItem) {
        const matchedCategoryDetails = await categories.findOne({
          id: matchedItem.id,
        });

        if (matchedCategoryDetails) {
          const subcategories = await categories.find({
            category_id: matchedCategoryDetails.id,
          });

          if (subcategories.length > 0) {
            const subcategoryKeyboard = {
              keyboard: [],
              resize_keyboard: true,
              one_time_keyboard: true,
            };

            for (let i = 0; i < subcategories.length; i += 3) {
              const row = [];
              for (let j = 0; j < 3; j++) {
                if (i + j < subcategories.length) {
                  row.push({
                    text: subcategories[i + j].name,
                    callback_data: `subcategory#${subcategories[i + j].id}`,
                  });
                }
              }
              subcategoryKeyboard.keyboard.push(row);
            }

            subcategoryKeyboard.keyboard.push([
              {
                text: "⬅️ Ortga",
                callback_data: `category#${matchedCategoryDetails.category_id}`,
              },
            ]);

            await bot.sendMessage(userId, "Quyidagilardan birini tanlang:", {
              reply_markup: subcategoryKeyboard,
              parse_mode: "HTML",
            });
          } else {
            await bot.sendMessage(
              userId,
              "❌ Bu kategoriyada subkategoriya yo'q."
            );
          }
        } else {
          await bot.sendMessage(userId, "❌ Bunday kategoriya topilmadi.");
        }
      }

      // Adding a product
      if (text === "➕ Qo'shish") {
        let step = admin.step.split("#")[2];
        step = step == "all" ? undefined : step;
        await AddProduct(bot, message, admin, step);
      } else if (text === "⬅️ Ortga") {
        await ProductCategoryBack(bot, message, admin);
      }
    }
    // Handling product addition steps
    else if (admin.step?.split("#")[0] === "addProduct") {
      let productId = admin.step.split("#")[1];
      let step = admin.step.split("#")[2];

      if (text === "⬅️ Ortga") {
        await DeleteProduct(bot, message, admin, productId);
      } else if (step === "name") {
        await ProductUpdateName(bot, message, admin, productId);
      } else if (step === "price") {
        await ProductImg(bot, message, admin, productId);
      } else if (step === "done" && text === "Saqlash") {
        await ProductSaveController(bot, message, admin);
      }
    }
    // Users count
    else if (admin.step === "0" && text === "👤 Foydalanuvchilari sonni") {
      await UsersCount(bot, message, admin);
    }
  } catch (err) {
    console.error("Error:", err);
  }
};
