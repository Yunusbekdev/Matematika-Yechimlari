require("dotenv").config();

const { env } = process;

module.exports = {
  TOKEN: env.TOKEN,
  MONGO_URL: env.MONGO_URL,
  ADMIN_TOKEN: env.ADMIN_TOKEN,
  ADMIN_ID: env.ADMIN_ID,
};
