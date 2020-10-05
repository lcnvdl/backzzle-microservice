const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

function start({ injection, onReceive }) {
    const port = injection.get("settings").express.port;

    app.post("/action", (req, res) => {
        let data = req.body;

        let cmd = data.cmd;

        if (data.id) {
            cmd += "." + data.id;
        }

        let args = [];

        if (data.args) {
            data.args.forEach(arg => {
                if (typeof arg === "string" && arg.indexOf(" ") === -1) {
                    args.push(arg);
                }
                else {
                    args.push(injection.get("JsonHelper").toB64(arg));
                }
            });
        }

        if (args.length > 0) {
            cmd += " " + args.join(" ");
        }

        onReceive(null, cmd, m => res.send(m), true);
    });

    app.listen(port, () => {
        console.log(`*** Serving on ${port} ***`);
    });
}

module.exports = start;