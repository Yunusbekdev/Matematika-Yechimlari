const admins = require("../../../Model/Admins");
const products = require("../../../Model/Product");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
    const channelId = -1002431600201;

    // Check if message.photo exists and has elements
    if (!message.photo || message.photo.length === 0) {
      await bot.sendMessage(
        userId,
        "❌ Rasm topilmadi. Iltimos, rasm yuboring."
      );
      return;
    }

    // Get the last image file ID from the photo array
    const imgFileID = message.photo[message.photo.length - 1].file_id;

    await admins.findOneAndUpdate(
      { user_id: userId },
      { step: `addProduct#${productId}#done` }
    );

    await products.findOneAndUpdate({ id: productId }, { pic: imgFileID });

    let product = await products.findOne({ id: productId });

    if (!product) {
      await bot.sendMessage(userId, "❌ Maxsulot topilmadi.");
      return;
    }

    // Try sending the photo to the channel
    try {
      await bot.sendPhoto(channelId, imgFileID);
    } catch (err) {
      console.error("Failed to send photo to channel:", err);
      await bot.sendMessage(
        userId,
        "❌ Kanalga rasm yuborishda xato yuz berdi."
      );
      return; // Exit if sending to the channel fails
    }

    // Send the photo back to the user
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
        message.from.id,
        "❌ Xato yuz berdi. Iltimos, qaytadan urinib ko'ring."
      );
    }
  }
};
