const { BaseController } = require("emvicify/controllers");

class HomeController extends BaseController {
    constructor({ services }) {
        super({ services });
    }

    action() {
        this.injection.get("log").info("Home/action called");
        return { result: true };
    }
}

module.exports = HomeController;
