/** @typedef {import("node-essential/src/controllers/controller-base")} ControllerBase */

const { Controllers } = require("node-essential");

const ControllerBase = Controllers.ControllerBase;

/**
 * @extends {ControllerBase}
 */
class HomeController extends ControllerBase {
    constructor(all) {
        super(all);
    }

    homeAction() {
        return "Home";
    }
}

module.exports = HomeController;