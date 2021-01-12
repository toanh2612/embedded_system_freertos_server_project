const q = 'tasks';

const open = require('amqplib').connect('amqp://toanh:toanh@45.32.11.198:5672');


open.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  // console.log(ch);
  return ch.assertQueue(q).then(function(ok) {
    console.log(ok);
    return ch.consume(q, function(msg) {
      console.log(msg);
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  });
}).catch(console.warn);
