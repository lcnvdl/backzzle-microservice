class RabbitEngine {
    constructor(injection) {
        this.injection = injection;
        this.instance = null;
    }

    initialize(onReceiveMessage) {
        // const injection = this.injection;
        // return new Promise((resolve, reject) => {
        //     let instance = new RabbitMicroService(this.injection, p => require(p), injection.get("settings"), onStart, onReceive, onModuleConnect);
        //     instance.initialize();

        //     function onModuleConnect(_, connection) {
        //         injection.get("services.user").initialize(connection);
        //     }

        //     function onStart() {
        //         console.log(" [*] Waiting for messages. To exit press CTRL+C");

        //         if (injection.get("settings").express && injection.get("settings").express.enabled) {
        //             require("./express-processor")({ injection, onReceive });
        //         }

        //         resolve();
        //     }

        //     async function onReceive(_, text, sendFn, resultsAsJson) {
        //         let send;
            
        //         if (!sendFn || typeof sendFn !== "function") {
        //             send = (m => instance.send(m));
        //         }
        //         else {
        //             send = sendFn;
        //         }

        //         await onReceiveMessage(text, send, resultsAsJson);
        //     }
        // });
    }
}

module.exports = RabbitEngine;

