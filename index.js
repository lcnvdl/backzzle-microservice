const { Backzzle } = require("backzzle");

const instance = new Backzzle();

instance.start().then(() => {
    instance.injection.get("log").info("Running");

    amqpTest();
}, err => {
    instance.injection.get("log").error("Application failed", err);
    process.exit(1);
});

/** 
 * @todo Delete this function. 
 **/
async function amqpTest() {
    console.log("AMQP TEST");

    const amqplib = require("amqplib");
    const connection = await amqplib.connect("amqp://user:bitnami@localhost:5672");
    const channel = await connection.createChannel();

    console.log("Channel creado");

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
            console.log("Respuesta", response);
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
        console.log("Test message sent");
    }, 500);

    setTimeout(() => {
        connection.close();
        console.log("Channel cerrado");
    }, 5000);
}