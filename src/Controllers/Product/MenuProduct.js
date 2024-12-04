const categories = require("../../Model/Categories");
const products = require("../../Model/Product");
const users = require("../../Model/Users");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const data = message.data;

    const type = data.split("#")[0];
    const id = data.split("#")[1];

    if (type !== "product") {
      return;
    }

    const product = await products.findOne({ id });

    if (!product) {
      await bot.sendMessage(userId, "❌ Mahsulot topilmadi");
      return;
    }

    const productCaption = `  ${product?.teacher}`;

    const category = await categories.findOne({ id: product.category_id });

    await users.findOneAndUpdate({ user_id: userId }, { step: "go" });

    if (!product?.pic) {
      await bot.sendMessage(userId, "❌ Rasm topilmadi");
      return;
    }
    if (typeof product.pic !== "string" || product.pic.trim() === "") {
      await bot.sendMessage(
        userId,
        "❌ Rasm fayl identifikatori yoki URL noto'g'ri."
      );
      return;
    }

    await bot.sendPhoto(userId, product.pic, {
      parse_mode: "HTML",
      caption: productCaption,
      disable_notification: true,
    });
  } catch (err) {
    console.error("Error:", err.toString());
    await bot.sendMessage(
      message.from.id,
      "❌ Xato yuz berdi. Iltimos, qaytadan urinib ko'ring."
    );
  }
};
