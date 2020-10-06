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

module.exports = {
    loadSettings
};