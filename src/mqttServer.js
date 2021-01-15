const mqtt = require('mqtt')
console.log('run MQTT');
import CONFIG from './config';
const client  = mqtt.connect(CONFIG['MQTT_URL']);
import _ from 'lodash';
import rethinkDb from "./db/rethinkDb";
const {   r } = rethinkDb;
import socketServer from './socketServer';
const { io } = socketServer;
client.on('connect', function () {
  // dht
  client.subscribe('device', function (err) {
    if (!err) {
    //   client.publish('test', 'Hello mqtt')
    } else {
      console.log(err);
    }
  })
})



client.on('message', async function (topic, message) {
  try {
      // message is Buffer
    message = JSON.parse(message.toString())
    console.log(topic,message);
    const data = {..._.pick(message, ['roomId','h','t','mode','type','deviceId'])}
    const datetime = (new Date()).getTime();
    // io.sockets.in(data.roomId).emit("server-to-client",data);
    // io.to(data.roomId).emit("server-to-client",data);

    if (['automatic','remote'].indexOf(data.type) !== -1){
      const deviceFound = await r.table("device").filter({deviceId: data.deviceId}).run();
      if (deviceFound.length === 0 ) {
        r.table("device").insert({
          datetime,...data
        }).run().catch((rethinkDbError)=>{
          console.log({rethinkDbError});
        })

      } else {
        r.table("device").filter({deviceId: data.deviceId}).update({
          datetime, ...data
        }).run().catch((rethinkDbError)=>{
          console.log({rethinkDbError});
        })
      }
    }
    if (data.type === 'warning' && data && data.mode !== null) {
      r.table("device").insert({
        datetime, ...data
      }).run().catch((rethinkDbError)=>{
        console.log({rethinkDbError});
      })
    }
    //io.sockets.in(roomId).emit("update-device-info",{});
    // io.to(data.roomId).emit("update-device-info",{});

  }catch(error) {
    console.log({error});
  }
//   client.end()


})
export default client;