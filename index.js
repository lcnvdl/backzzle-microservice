const Backzzle = require("./backzzle/backzzle");

const instance = new Backzzle();

instance.start().then(() => {
    instance.injection.get("log").info("Running");
}, err => {
    instance.injection.get("log").error("Application failed", err);
    process.exit(1);
});
