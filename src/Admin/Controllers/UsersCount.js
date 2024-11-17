module.exports = async function (bot, message, admin) {
  try {
    const userSet = new Set();
    const userId = message.from.id;
    userSet.add(userId);

    function getUniqueUserCount() {
      return userSet.size;
    }

    await bot.sendMessage(
      userId,
      `Foydaluvchilar sonni: ${getUniqueUserCount()}`
    );
  } catch (error) {
    console.log(err + "");
  }
};
