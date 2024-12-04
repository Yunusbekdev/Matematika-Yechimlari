const products = require("../../../Model/Product");
const users = require("../../../Model/Users");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
    const channelId = -1002431600201;

    if (!message.photo || message.photo.length === 0) {
      await bot.sendMessage(
        userId,
        "❌ Rasm topilmadi. Iltimos, rasm yuboring."
      );
      return;
    }

    const imgFileID = message.photo[message.photo.length - 1].file_id;

    await users.findOneAndUpdate(
      { user_id: admin?.user_id },
      { step: `addProduct#${productId}#done` }
    );

    await products.findOneAndUpdate({ id: productId }, { pic: imgFileID });

    let product = await products.findOne({ id: productId });

    if (!product) {
      await bot.sendMessage(userId, "❌ Maxsulot topilmadi.");
      return;
    }

    try {
      await bot.sendPhoto(channelId, imgFileID, {
        caption: `${product.id}`,
      });
    } catch (err) {
      console.error("Kanallarga rasmani yuborishda xato:", err);
      await bot.sendMessage(
        userId,
        "❌ Kanalga rasmini yuborishda xato yuz berdi."
      );
    }

    await bot.sendPhoto(userId, imgFileID, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: "Saqlash" }, { text: "⬅️ Ortga" }]],
      },
      parse_mode: "HTML",
    });
  } catch (err) {
    console.error("Ishlashda xato:", err);
    if (message.from) {
      await bot.sendMessage(
        message.from.id,
        `❌ Xato yuz berdi: ${err.message}. Iltimos, qaytadan urinib ko'ring.`
      );
    }
  }
};
