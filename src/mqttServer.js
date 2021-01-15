const mqtt = require('mqtt')
import CONFIG from './config';
const client  = mqtt.connect(CONFIG['MQTT_URL']);
import _ from 'lodash';
import { io } from './socketServer';
client.on('connect', function () {
  // dht
  client.subscribe('s-01-6a451aef-4d78-49e7-a864-8cceddf2f3fe', function (err) {
    if (!err) {
    //   client.publish('test', 'Hello mqtt')
    }
  })

  // pir 
  client.subscribe('s-01-22a810ca-bef3-41cf-9247-3b725a9c926d', function (err) {
    if (!err) {
    //   client.publish('test', 'Hello mqtt')
    }
  })
})
 

client.on('message', function (topic, message) {
  try {
      // message is Buffer
    message = JSON.parse(message.toString())
    const data = {..._.pick(message, ['roomId','h','t','mode','type','deviceId'])}
    io.to(data.roomId).emit("server-local-device",data);

  }catch(error) {

  }
//   client.end()


})
export default client;