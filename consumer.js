const amqplib = require('amqplib')
const ampqp_url_docker = 'amqp://localhost:5672/'


// run this code with other consumers will register the same queue but message will be distributed in a round-robin fashion
const receiveQueue = async () => {
    try {
        //1. Create connect
        const conn = await amqplib.connect((ampqp_url_docker))
        //2. Create channel
        const channel = await conn.createChannel()
        //3. Create queue
        const nameQueue = 'q1'
        await channel.assertQueue(nameQueue, {
            durable: true
        })
        //5. Receive queue
        await channel.consume(nameQueue, msg => console.log(`Msg::`, msg.content.toString()), {
            noAck: true
            // false: xac nhan chua nhan msq => msg still in queue, nguoc lai se xoa msg trong queue
            // msg will be distributed if there is another consumer running
        })
        //6. Close connection and channel

    } catch (e) {
        console.log(e)
    }
}

receiveQueue()