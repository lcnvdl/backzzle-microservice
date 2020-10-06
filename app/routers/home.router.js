const { ExpressRouter } = require("emvicify/routers");

class HomeRouter extends ExpressRouter {
    constructor({ settings, controllers, middlewares, routerSettings }) {
        super({ settings, controllers, middlewares, routerSettings });
    }

    registerActions() {
        this.get("home/action", (req, res) => this.controllers.home.action({ req, res }));
    }
}

module.exports = HomeRouter;
