const q = 'tasks';

const open = require('amqplib').connect('amqp://toanh:toanh@45.32.11.198:5672');

open.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  return ch.assertQueue(q).then(function(ok) {
    return ch.sendToQueue(q, Buffer.from('something to do'));
  });
}).catch(console.warn);
