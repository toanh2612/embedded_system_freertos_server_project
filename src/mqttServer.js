const mqtt = require('mqtt')
console.log('run MQTT');
import CONFIG from './config';
const client  = mqtt.connect(CONFIG['MQTT_URL']);
import _ from 'lodash';
import { io } from './socketServer';
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
 

client.on('message', function (topic, message) {
  try {
      // message is Buffer
    message = JSON.parse(message.toString())
    console.log(topic,message);
    const data = {..._.pick(message, ['roomId','h','t','mode','type','deviceId'])}
    io.to(data.roomId).emit("server-local-device",data);

  }catch(error) {

  }
//   client.end()


})
export default client;