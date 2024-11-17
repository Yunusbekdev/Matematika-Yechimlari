const orders = require("../../Model/Orders");

module.exports = async function (bot, message, user) {
  try {
    const userId = message.from.id;
    const order = await orders.find({ id: userId });

    const kitoblarQatori = [
      [
        { text: "F.O'roqov qo'llanma", callback_data: "kitob1" },
        { text: "Oq To'plam", callback_data: "kitob2" },
      ],
      [{ text: "Samarqand To'plam", callback_data: "kitob3" }],
    ];

    if (order.length === 0) {
      await bot.sendMessage(userId, "Quyidagi nashrlardan birini tanlang👇", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: kitoblarQatori,
        },
      });
    }
  } catch (err) {
    console.log(err + "");
  }
};
