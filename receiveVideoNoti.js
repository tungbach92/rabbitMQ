const amqplib = require('amqplib')
const ampqp_url_docker = 'amqp://localhost:5672'

const receiveVideoNoti = async () => {
    try {
        //1. Create connect
        const conn = await amqplib.connect((ampqp_url_docker))
        //2. Create channel
        const channel = await conn.createChannel()
        //3. Create exchange
        const nameExchange = 'video' //same name exchange
        await channel.assertExchange(nameExchange, 'fanout', {
            durable: false
        })
        //4. create queue video
        const {
            queue // name queue created
        } = await channel.assertQueue('', { // Receive any queues
            exclusive: true, // delete queue if receiveVideoNoti not running
            durable: false
        })
        console.log(`name queue::: ${queue}`)
        //5. Binding to queue
        await channel.bindQueue(queue, nameExchange, '')
        await channel.consume(queue, msg => {
            console.log(`msg::`, msg.content.toString())
        }, {
            noAck: true
        })

    } catch (e) {
        console.log(e)
    }
}
receiveVideoNoti()
