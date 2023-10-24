const amqplib = require('amqplib')
const ampqp_url_docker = 'amqp://localhost:5672'

// Ex: gui email thong bao den cac bo phan tra soat trong ngan hang, khi dang tra soat cho k/h
const receiveMail = async () => {
    try {
        //1. Create connect
        const conn = await amqplib.connect((ampqp_url_docker))
        //2. Create channel
        const channel = await conn.createChannel()
        //3. Create exchange
        const nameExchange = 'send_mail'
        await channel.assertExchange(nameExchange, 'topic', { // san giao dich anyone can interact
            durable: false
        })
        //4. Create queue
        const {queue} = await channel.assertQueue('', {
            exclusive: true,
        })

        //5. Binding queue
        const args = process.argv.slice(2);
        if (!args.length) {
            process.exit(0)
        }
        console.log(`waiting queue ${queue}::: topic:: ${args}`)
        for (const key of args) {
            await channel.bindQueue(queue, nameExchange, key)
        }

        await channel.consume(queue, msg => {
            console.log(`Routing key:${msg.fields.routingKey}::: msg:::${msg.content.toString()}`)
        })

    } catch (e) {
        console.log(e)
    }
}
receiveMail()
