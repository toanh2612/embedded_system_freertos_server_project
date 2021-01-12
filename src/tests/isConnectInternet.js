const CONFIG = {
  RABBITMQ_SERVER_URL:'amqp://toanh:toanh@45.32.11.198:5672',
  RABBITMQ_LOCAL_URL:'amqp://toanh:toanh@127.0.0.1:5672'
}
let openRabbitMqServer = require('amqplib').connect(CONFIG["RABBITMQ_SERVER_URL"]);
let openRabbitMqLocal = require('amqplib').connect(CONFIG["RABBITMQ_LOCAL_URL"]);
let connectRabbitMqLocal =  openRabbitMqLocal.then(function(conn) {
  return conn.createChannel();
})
let connectRabbitMqServer =  openRabbitMqServer.then(function(conn) {
  return conn.createChannel();
})
const isOnline = require('is-online');

const ping = require('ping');
const hosts = ['45.32.11.198','google.com'];
const pingPromise = ({host}) => {
  return new Promise(async (resolve, reject) => {
    try {
        return await ping.promise.probe(host)
          .then((res)=>{
            if (res && res.hasOwnProperty('alive')){
              return resolve(res);
            } else {
              return resolve(null)
            }
          }).catch(error => {
            return reject(error);
          })
    } catch (e){
      return reject(e);
    }
  });
}

async function intervalFunc() {
  let count = 0;
  const _isOnline = await isOnline();
  await Promise.all(hosts.map(async (host)=>{
      return await pingPromise({host}).then((res)=> {return res});
  })).then(results => {
    results.map((result=>{
      if (result && result['alive']) {
        count++;
      }
    }));
  })

  if (_isOnline && count === hosts.length){
    console.log("Sync data");
    const localToServerQueue = 'local_server';
    const serverToLocalQueue = 'server_local';

    connectRabbitMqLocal.then(function(ch) {
      // console.log(ch);
      return ch.assertQueue(localToServerQueue).then(function(ok) {
        return ch.consume(localToServerQueue, function(msg) {
          console.log(msg);
          if (msg !== null) {
            // console.log(msg.content.toString());
            ch.ack(msg);
            connectRabbitMqServer.then(function(ch) {
              return ch.assertQueue(localToServerQueue).then(function(ok) {
                return ch.sendToQueue(localToServerQueue, msg.content);
              });
            }).catch(()=>{
              openRabbitMqServer = require('amqplib').connect(CONFIG["RABBITMQ_SERVER_URL"]);
              connectRabbitMqServer =  openRabbitMqServer.then(function(conn) {
                return conn.createChannel();
              });
            });
          }
        });
      });

    }).catch(()=>{
      openRabbitMqLocal = require('amqplib').connect(CONFIG["RABBITMQ_LOCAL_URL"]);
      connectRabbitMqLocal =  openRabbitMqLocal.then(function(conn) {
        return conn.createChannel();
      })
    });

    connectRabbitMqServer.then(function(ch) {
      // console.log(ch);
      return ch.assertQueue(serverToLocalQueue).then(function(ok) {
        return ch.consume(serverToLocalQueue, function(msg) {
          console.log(msg);
          if (msg !== null) {
            // console.log(msg.content.toString());
            ch.ack(msg);
            connectRabbitMqLocal.then(function(ch) {
              return ch.assertQueue(serverToLocalQueue).then(function(ok) {
                return ch.sendToQueue(serverToLocalQueue, msg.content);
              });
            }).catch(()=>{
              openRabbitMqLocal = require('amqplib').connect(CONFIG["RABBITMQ_LOCAL_URL"]);
              connectRabbitMqLocal =  openRabbitMqLocal.then(function(conn) {
                return conn.createChannel();
              })
            });
          }
        });
      });

    }).catch(()=>{
      openRabbitMqServer = require('amqplib').connect(CONFIG["RABBITMQ_SERVER_URL"]);
      connectRabbitMqServer =  openRabbitMqServer.then(function(conn) {
        return conn.createChannel();
      })
    });

    // open.then(function(conn) {
    //   return conn.createChannel();
    // }).then(function(ch) {
    //   return ch.assertQueue(q).then(function(ok) {
    //     return ch.sendToQueue(q, Buffer.from('something to do'));
    //   });
    // }).catch(console.warn);
    //
    // open.then(function(conn) {
    //   return conn.createChannel();
    // }).then(function(ch) {
    //   // console.log(ch);
    //   return ch.assertQueue(q).then(function(ok) {
    //     return ch.consume(q, function(msg) {
    //       console.log(msg);
    //       if (msg !== null) {
    //         console.log(msg.content.toString());
    //         ch.ack(msg);
    //       }
    //     });
    //   });
    // }).catch(console.warn);
  }
  console.log({
    time: (new Date()).toLocaleTimeString(),
    isOnline: _isOnline,
    success: `${count}/${hosts.length}`
  });
}

setInterval(intervalFunc, 1000);
