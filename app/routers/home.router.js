const { MultiRouter } = require("backzzle");

class HomeRouter extends MultiRouter {
    constructor({ settings, controllers, middlewares, routerSettings }) {
        super({ settings, controllers, middlewares, routerSettings });
    }

    registerActions() {
        this.get("home/action", () => this.controllers.home.action());
    }
}

module.exports = HomeRouter;
