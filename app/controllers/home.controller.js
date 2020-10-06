const { BaseController } = require("emvicify/controllers");

class HomeController extends BaseController {
    constructor({ services }) {
        super({ services });
    }
}

module.exports = HomeController;
