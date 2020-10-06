const { BaseController } = require("emvicify/controllers");

class HomeController extends BaseController {
    constructor({ services }) {
        super({ services });
    }

    action() {
        return { result: true };
    }
}

module.exports = HomeController;
