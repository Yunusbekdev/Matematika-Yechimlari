const admins = require("../../../Model/Admins");
const products = require("../../../Model/Product");

module.exports = async function (bot, message, admin, productId) {
  try {
    const userId = message.from.id;
    const channelId = -1002431600201;

    // Update the admin's step
    await admins.findOneAndUpdate(
      { user_id: userId },
      { step: `addProduct#${productId}#done` }
    );

    // Update the product with the photo ID
    await products.findOneAndUpdate(
      { id: productId },
      { pic: message.photo[0].file_id }
    );

    // Retrieve the updated product
    let product = await products.findOne({ id: productId });

    // Check if the product was found
    if (!product) {
      await bot.sendMessage(userId, "❌ Maxsulot topilmadi.");
      return;
    }

    // Attempt to send the photo to the channel
    try {
      await bot.sendPhoto(channelId, message.photo[0].file_id, {
        caption: `<b>Mavzu nomi: </b> ${product.name}\n<b>Misollar raqami: </b> ${product.price}\n<b>Mavzu haqida malumot: </b> ${product.description}\n`,
        parse_mode: "HTML",
      });
    } catch (err) {
      console.error("Failed to send photo to channel:", err);
    }

    // Send the photo to the user
    await bot.sendPhoto(userId, message.photo[0].file_id, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: "Saqlash" }, { text: "⬅️ Ortga" }]],
      },
      caption: `<b>Mavzi nomi: </b> ${product.name}\n<b>Maxsulot narxi: </b> ${product.price} so'm\n<b>Maxsulot haqida malumot: </b> ${product.description}\n`,
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
