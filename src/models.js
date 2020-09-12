function Game(title, price, categories) {
    this.title = title;
    this.price = price;
    this.categories = categories;
}

function Category(name) {
    this.name = name;
}

function Order(products, userId) {
    this.products = products;
    this.userId = userId;
}

function User(login, password, fullname) {
    this.login = login;
    this.password = password;
    this.fullname = fullname;
}

module.exports = {
    Game,
    Category,
    Order,
    User
};
