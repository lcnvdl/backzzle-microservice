/** @typedef {import("node-essential/src/managers/system/controllers.manager")} ControllersManager */

function loadSettings( _process) {
    const args = _process.argv.slice(2);
    const cwd = _process.cwd();
    const path = require("path");

    let settings = "settings.json";

    for (let i = 0; i < args.length; i++) {
        const a = args[i];

        if (a.indexOf(".json") !== -1) {
            settings = a;
        }
        else if (a == "-s" || a === "--settings") {
            settings = args[++i];
        }
    }

    // console.log(`Loading settings from ${settings}`);

    let settingsObject = require(path.join(cwd, settings));

    while (settingsObject.$inherit) {
        const parent = settingsObject.$inherit;
        delete settingsObject.$inherit;
        // console.debug(` - Loading parent settings from ${parent}`);

        let parentObject = require(path.join(cwd, parent));
        settingsObject = Object.assign(parentObject, settingsObject);
    }

    return settingsObject;
}

function loadExpress(injection) {
    const app = require("express")();

    const { port, cors, json, urlencoded } = injection.get("settings");

    if (cors) {
        const cors = require("cors");
        app.use(cors());
    }

    if (urlencoded) {
        app.use(bodyParser.urlencoded({ extended: false }));
    }

    if (json) {
        app.use(bodyParser.json());
    }

    app.listen(port, () => {
        log.info(`Running express on port ${port}`);
    });
}

/**
 * @param {ControllersManager} manager Controllers manager
 */
function loadControllers(injection, manager) {
    const promise = new Promise((resolve, reject) => {
        const glob = require("glob");
        const path = require("path");
        glob(path.join(process.cwd(), "app", "controllers", "*.controller.js"), (err, matches) => {
            if (err) {
                reject(err);
                return;
            }

            const log = injection.get("log");

            matches.forEach(match => {
                log.info(match);
                const Klass = require(match);
                manager.add(Klass);
            });

            resolve();
        });
    });

    return promise;
}

async function onReceiveMessage(injection, text, sendFn, resultsAsJson) {
    const log = injection.get("log");

    log.debug(" [x] Received %s", text);

    let split = text.split(" ");
    let cmd = split[0];
    let id;

    if (cmd.indexOf(".") > 0) {
        id = cmd.substr(cmd.indexOf(".") + 1);
        cmd = cmd.substr(0, cmd.indexOf("."));
    }
    else {
        id = null;
    }

    try {
        const args = split.slice(1);
        const manager = injection.get(ControllersManager);

        if (args.length === 1 && !id) {
            id = args.pop();
        }

        let result = await(id ? manager.action(cmd, id, args) : manager.action(cmd, args));
        result = resultsAsJson ? JSON.stringify(result) : injection.get("JsonHelper").toB64(result);

        if (id) {
            sendFn(`${cmd} ${id} ${result}`);
        }
        else {
            sendFn(`${cmd} ${result}`);
        }
    } catch (err) {
        log.error(err);

        if (err instanceof Error) {
            err = err.message;
        }

        if (id) {
            sendFn(`${cmd} ${id} error ${err}`);
        }
        else {
            sendFn(`${cmd} error ${err}`);
        }
    }
}

module.exports = {
    loadControllers,
    loadExpress,
    loadSettings,
    onReceiveMessage
};