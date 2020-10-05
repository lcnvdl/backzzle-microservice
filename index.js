/** @typedef {import("node-essential/src/managers/system/controllers.manager")} ControllersManager */
/** @typedef {import("node-essential/src/managers/system/injection.manager")} InjectionManager */

const essential = require("node-essential");

/** @type {InjectionManager} */
const injection = new essential.Managers.System.InjectionManager();

/** @type {ControllersManager} */
const manager = new essential.Managers.System.ControllersManager(injection);

//  Main loop
(async function main() {
    const { loadControllers, loadExpress, loadSettings, onReceiveMessage } = require("./backzzle/main");

    const settings = loadSettings(process);
    injection.add("settings", () => settings);

    /** @todo If you want to use your own logger, just replace this line. */
    injection.add("log", () => new (require("./backzzle/default-logger"))());

    await loadControllers(injection, manager);

    if (settings.amqp && settings.amqp.enabled) {
        const RabbitEngine = require("./backzzle/rabbit-engine");
        const engine = new RabbitEngine(injection);
        engine.initialize(onReceiveMessage);
    }

    /*if (settings.express && settings.express.enabled) {
        loadExpress(injection);
    }*/
})();