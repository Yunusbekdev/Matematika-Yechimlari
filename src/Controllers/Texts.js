module.exports = class Texts {
  static MenuMsg() {
    return {
      text: "Quyidagilardan birini tanlang",
      keyboard: {
        order: "📊 Kitob yechimlari",
        orders: "📚 Kitoblar",
        comment: "✍️ Fikr bildirish",
      },
    };
  }

  static startOrderMenu() {
    return {
      text: "Quydagilardan birini tanlang",
      btns: {
        comment: "✍️ Fikr bildirish",
      },
    };
  }

  static Menu(lang) {
    if (lang == "uz") {
      return "Kategoriyalardan birini tanlang";
    }
  }
};
