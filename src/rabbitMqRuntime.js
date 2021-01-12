import CONFIG from "./config";
import axios from 'axios';
const endPoint = `http://${CONFIG['APP_IP_LOCAL']}:${CONFIG['APP_PORT']}`
const serverToLocalQueue ='server_local';
const localToServerQueue ='local_server';

let openRabbitMqServer = require('amqplib').connect(CONFIG["RABBITMQ_SERVER_URL"]);
import socketServer from "./socketServer";
const { io } = socketServer;
import rethinkDb from "./db/rethinkDb";
const { rethinkORM , r } = rethinkDb;
let connectRabbitMqServer =  openRabbitMqServer.then(function(conn) {
  return conn.createChannel();
})
connectRabbitMqServer.then(function(ch) {
  // console.log(ch);
  return ch.assertQueue(localToServerQueue).then(function(ok) {
    return ch.consume(localToServerQueue, async function(msg) {
      console.log(msg);
      if (msg !== null) {
        let content = msg.content.toString();
        content = JSON.parse(content);
        console.log(content);
        const { type } = content;
        if (type === 'coreApi' ) {
          const option = content["httpRequest"];
          await axios({
            method: option.method,
            url: `${endPoint}${option.originalUrl}`,
            data: option['body'] || {},
            params: option['query'] || {},
            headers: option['headers'] || {}
          }).then((axiosResult)=>{
            console.log({
              axiosResult
            });
          })
        }
        if (type === 'device') {
          const option = content["deviceData"];
          let {roomId, type, deviceId, mode, h, t, datetime} = option;
          h = h || null;
          t = t || null;
          mode = mode || null;
          if (roomId && roomId && type && deviceId){

            // console.log(mode, h, t)
            if (['automatic','remote'].indexOf(type) !== -1){
              const deviceFound = await r.table("device").filter({deviceId}).run();
              if (deviceFound.length === 0 ) {
                r.table("device").insert({
                  datetime,deviceId,mode,h,t,type
                }).run().catch((rethinkDbError)=>{
                  console.log({rethinkDbError});
                })

              } else {
                r.table("device").filter({deviceId}).update({
                  datetime, deviceId,mode,h,t,type
                }).run().catch((rethinkDbError)=>{
                  console.log({rethinkDbError});
                })
              }
            }
            if (type === 'warning' && mode !== null) {
              r.table("device").insert({
                datetime, deviceId,mode,type
              }).run().catch((rethinkDbError)=>{
                console.log({rethinkDbError});
              })
            }
            //io.sockets.in(roomId).emit("update-device-info",{});
            io.to(roomId).emit("update-device-info",{});
          }
        }
        // console.log(msg.content.toString());
        // await axios({
        //   method:''
        // })
        ch.ack(msg);

      }
    });
  });

}).catch(()=>{
  openRabbitMqServer = require('amqplib').connect(CONFIG["RABBITMQ_SERVER_URL"]);
  connectRabbitMqServer =  openRabbitMqServer.then(function(conn) {
    return conn.createChannel();
  })
});
