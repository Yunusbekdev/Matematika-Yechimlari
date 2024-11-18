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
        orders: "📚 Kitoblar",
        comment: "✍️ Fikr bildirish",
      },
    };
  }

  static Menu(lang) {
    if (lang == "uz") {
      return "Kategoriyalardan birini tanlang";
    }
    if (lang == "ru") {
      return "Выберите одну из категорий";
    }
    if (lang == "eng") {
      return "Choose one of the categories";
    }
  }
};
