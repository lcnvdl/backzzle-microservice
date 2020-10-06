const BaseRouter = require("../base/base-router");

class HomeRouter extends BaseRouter {
    constructor({ settings, controllers, middlewares, routerSettings }) {
        super({ settings, controllers, middlewares, routerSettings });
    }

    registerActions() {
        this.get("home/action", () => this.controllers.home.action());
    }
}

module.exports = HomeRouter;
