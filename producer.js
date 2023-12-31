const amqplib = require('amqplib')
const ampqp_url_docker = 'amqp://localhost:5672'

const sendQueue = async ({msg}) => {
    try {
        //1. Create connect
        const conn = await amqplib.connect((ampqp_url_docker))
        //2. Create channel
        const channel = await conn.createChannel()
        //3. Create queue
        const nameQueue = 'q1'
        await channel.assertQueue(nameQueue, {
            durable: true // true: queue with msg is durable when restart server
        })
        //5. Send to queue
        await channel.sendToQueue(nameQueue, Buffer.from(msg), {
            persistent: true // save to cache
        })
        //6. Close connection and channel


    } catch (e) {
        console.log(e)
    }
}

const msg = process.argv.slice(2).join(' ') || "Hello" //get arg ex: node producer.js hello1 -> hello1
sendQueue({msg})