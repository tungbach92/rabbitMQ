const amqplib = require('amqplib')
const ampqp_url_docker = 'amqp://localhost:5672'

const postVideo = async ({msg}) => {
    try {
        //1. Create connect
        const conn = await amqplib.connect((ampqp_url_docker))
        //2. Create channel
        const channel = await conn.createChannel()
        //3. Create exchange
        const nameExchange = 'video'
        await channel.assertExchange(nameExchange, 'fanout', { // san giao dich anyone can interact
            durable: false
        })
        //4. Publish video
        await channel.publish(nameExchange, '', Buffer.from(msg)) // '' not send to specific queue
        console.log(`[x] Send ok::::${msg}`)
        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 2000)

    } catch (e) {
        console.log(e)
    }
}
const msg = process.argv.slice(2).join(' ') || "Hello exchange"
postVideo({msg})
