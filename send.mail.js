const amqplib = require('amqplib')
const ampqp_url_docker = 'amqp://localhost:5672'

// Ex: gui email thong bao den cac bo phan tra soat trong ngan hang, khi dang tra soat cho k/h
const sendMail = async () => {
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

        const  args = process.argv.slice(2);
        const msg = args[1] || 'Fixed!'
        const topic = args[0]
        console.log(`msg::${msg}::::topic::${topic}`)

        //4. Publish mail
        await channel.publish(nameExchange, topic, Buffer.from(msg)) // '' not send to specific queue
        console.log(`[x] Send ok::::${msg}`)
        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 2000)

    } catch (e) {
        console.log(e)
    }
}
sendMail()
