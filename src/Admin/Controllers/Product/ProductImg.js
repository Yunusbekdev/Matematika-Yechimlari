const admins = require("../../../Model/Admins");
const products = require("../../../Model/Product");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
    const channelId = -1002431600201;
    const imgFileID = message?.photo[message?.photo?.length - 1].file_id;

    await admins.findOneAndUpdate(
      { user_id: userId },
      { step: `addProduct#${productId}#done` }
    );

    await products.findOneAndUpdate({ id: productId }, { pic: imgFileID });
    console.log(imgFileID, "imgFileID", message?.photo[0].file_id);

    let product = await products.findOne({ id: productId });

    if (!product) {
      await bot.sendMessage(userId, "❌ Maxsulot topilmadi.");
      return;
    }

    try {
      await bot.sendPhoto(channelId, imgFileID);
    } catch (err) {
      console.error("Failed to send photo to channel:", err);
    }

    await bot.sendPhoto(userId, imgFileID, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: "Saqlash" }, { text: "⬅️ Ortga" }]],
      },
      parse_mode: "HTML",
    });
  } catch (err) {
    console.error("Error in processing:", err);
    if (message.from) {
      await bot.sendMessage(
        userId,
        "❌ Xato yuz berdi. Iltimos, qaytadan urinib ko'ring."
      );
    }
  }
};
