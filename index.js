const { Backzzle } = require("backzzle");

const instance = new Backzzle();

instance.start().then(() => {
    instance.injection.get("log").info("Running");

    /** @todo Delete the amqpTest functino call. */
    amqpTest();
}, err => {
    instance.injection.get("log").error("Application failed", err);
    process.exit(1);
});

/** 
 * @deprecated
 * @todo Delete this function. 
 **/
async function amqpTest() {
    instance.injection.get("log").debug("AMQP TEST");

    const amqplib = require("amqplib");
    const connection = await amqplib.connect("amqp://user:bitnami@localhost:5672");
    const channel = await connection.createChannel();

    instance.injection.get("log").debug("Channel creado");

    const name = "backzzle-exchange-demo";

    const exchange = await channel.assertExchange(
        name,
        "fanout",
        { durable: false });

    const data = {
        id: "",
        url: "home/action",
        data: {},
        headers: {}
    };

    const q = await channel.assertQueue("", { exclusive: true });
    const id = new Date().getTime().toString();

    channel.consume(q.queue, msg => {
        if (msg && msg.properties.correlationId === id) {
            const response = JSON.parse(msg.content.toString());
            instance.injection.get("log").debug("Respuesta", response);
        }
    }, {
        noAck: true
    });

    setTimeout(() => {
        channel.publish(
            name,
            "",
            Buffer.from(JSON.stringify(data)), {
            replyTo: q.queue,
            correlationId: id
        });
        instance.injection.get("log").debug("Test message sent");
    }, 500);

    setTimeout(() => {
        connection.close();
        instance.injection.get("log").debug("Channel cerrado");
    }, 5000);
}