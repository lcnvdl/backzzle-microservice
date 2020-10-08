const { BaseController } = require("emvicify/controllers");

class HomeController extends BaseController {
    constructor({ services }) {
        super({ services });
    }

    action() {
        console.log("Home/action called");
        return { result: true };
    }
}

module.exports = HomeController;
