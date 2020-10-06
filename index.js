/** @typedef {import("node-essential/src/managers/system/injection.manager")} InjectionManager */

const essential = require("node-essential");
const { loadSettings } = require("./backzzle/main");

const { start } = require("emvicify");
const settingsFile = loadSettings(process);
const expressSettings = {
    json: settingsFile.express.json,
    bodyParserUrlencoded: false,
    bodyParserRaw: false,
    cors: settingsFile.express.cors
};

const Engines = require("emvicify").engines;

const engines = [];

if (settingsFile.express.enabled) {
    const express = new Engines.ExpressEngine(null, settingsFile.express.port, expressSettings);
    engines.push(express);
}

if (settingsFile.amqp.enabled) {
    const amqp = require("amqplib");
    const amqpSettings = settingsFile.amqp;
    const rabbitEngine = new Engines.RabbitMQEngine(amqp, amqpSettings);
    engines.push(rabbitEngine);
}

/** @type {InjectionManager} */
const injection = new essential.Managers.System.InjectionManager();

/** @todo If you want to use your own logger, just replace this line. */
injection.add("log", () => new (require("./backzzle/default-logger"))());

start(process.cwd(), settingsFile.express.port, { settingsFile, expressSettings, engines }).then(() => {
    console.log(`Listening on port ${settingsFile.express.port}`);
}, err => {
    console.error("Application failed", err);
    process.exit(1);
});
