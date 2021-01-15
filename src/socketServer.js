import rabbitMQService from "./services/rabbitMQService";

const server = require('http').createServer();
import CONFIG from "./config";
import rethinkDb from "./db/rethinkDb";
const { rethinkORM , r } = rethinkDb;
import _ from 'lodash';
import mqttClient from './mqttServer';
const io = require('socket.io')(server, {
  // path: '/test',
  serveClient: true,
  // below are engine.IO options
  pingInterval: 60 * 60 * 1000 * 24,
  pingTimeout: 60 * 60 * 10,
  cookie: false,
  setTimeout: 60 * 60 * 1000 * 24
});
const rooms = {};
io.on("connection", (socket) => {
  socket.on("join-room", async ({ roomId }) => {

    try {
      console.log({
        task:"join-room",
        roomId
      });
      socket.join(roomId);
      socket.roomId = roomId;
      if (rooms[socket.roomId] === null || rooms[socket.roomId] === undefined) {
        rooms[socket.roomId] = [];
      }
      if (rooms[socket.roomId].indexOf(socket.id) === -1) {
        rooms[socket.roomId].push(socket.id);
      }
      console.log({ rooms });
    } catch (error) {
      console.log({ task: "socket.io", error });
    }
  });
  socket.on("request-device-info", async ({roomId,deviceId})=>{
    const type = await r.table("device").filter({deviceId}).orderBy(r.desc('datetime')).limit(1).run((res)=>{
      return res && res[0] && res[0].type;
    })
    let limit = 5;
    if (type === 'warning') {
      limit = 10;
    }
    const result = await r.table("device").filter({deviceId}).orderBy(r.desc('datetime')).limit(limit).run();
    io.sockets.in(roomId).emit('response-device-info', result);
  });
  socket.on("server-local-device", async (param)=>{
    try {
      console.log(param);
      if (param && typeof(param) ==='string') {
        param = JSON.parse(param);
      } else if (!param) {
        return;
      }
  
      let {roomId, type, deviceId, mode, h, t} = param;
  
      console.log({
        task:"server-local-device",
        data: {roomId, type, deviceId, mode, h, t}
      });
      h = h || null;
      t = t || null;
      mode = mode || null;
      if (roomId && roomId && type && deviceId){
        const datetime = (new Date()).getTime();
        // io.sockets.in(data.roomId).emit("server-to-client",data);
        // io.to(data.roomId).emit("server-to-client",data);
        console.log(mode, h, t)
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
        const queueData = {
          type:"device",
          deviceData:{roomId, type, deviceId, mode, h, t}
        };
        rabbitMQService.sender({queueName:'server_local',queueData,mode:'server'});
        // await rabbitMQService.sender({queueName:'local_server',queueData,mode:'local'});
        let topic = (deviceId ==="s-01-7a4e04cf-e449-41aa-b401-8f51aae57d00") ? 'led1' : 'led2'
        try {
          console.log(topic, mode ? mode.toString() : "0");
          mqttClient.publish(topic, mode ? mode.toString() : "0")
        } catch(errror) {
          console.log({error});
        }
      }
  
    }catch(error){
      console.log({
        error
      });
    }
  });
  socket.on("disconnect", function (data) {
    try {
      socket.leave(socket.roomId);
      if (socket.roomId && rooms[socket.roomId]) {
        console.log({
          event: 'disconnect',
          roomId: socket.roomId,
          client: socket.id
        });
        rooms[socket.roomId].splice(rooms[socket.roomId].indexOf(socket.id), 1);
      }

    } catch (e) {
      console.log(e);
    }
  });
});


server.listen(Number(CONFIG["SOCKET_IO_PORT"]),'0.0.0.0', ()=>{
  console.log(`Run socketIO server ${CONFIG["SOCKET_IO_HOST"]}:${CONFIG["SOCKET_IO_PORT"]}`)
});

export default { io };
