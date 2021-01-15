const locationHost = '45.32.11.198:5001';
const appHost = locationHost.split(':')[0];
const appPort = locationHost.split(':')[1];
const endpoint = `http://${appHost}:${appPort}/api`;
const loginEndPoint = `${endpoint}/public/login`;
let datetimeLast =0;
let roomId = '';

function setCookie({cname, cvalue, exdays}) {
  exdays = exdays || 1;
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJhZG1pbiIsImlhdCI6MTYxMDA3MzA5Mn0.TcwrY3ArpO4L3abBS_Fv7YTdTa0D55vRX3Wx4Eix3bs'
const token = getCookie("token");
console.log(token);
if (!token) {
  window.location.href = '/login';
}
const getHomeInfo = () => {
  return new Promise((resolve, reject) =>{
    try {
      $.ajax(`${endpoint}/homes`,{
        method: 'get',
        headers: {
          'token': token
        },
        success: function (data, status, xhr) {
          return resolve(data);
        }
      })
    } catch (e){
      window.location.href = '/login';
      return reject(e)
    }
  })
}



function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const changeLedStatus = (id) => {
  const el = document.getElementById(id);
  socket.emit("server-local-device",{roomId:"s-01",deviceId:id, mode: el.checked ? 1 : 0,"type":"remote"});
  socket2.emit("server-local-device",{roomId:"s-01",deviceId:id, mode: el.checked ? 1 : 0,"type":"remote"});
}

const strTime = (dt) => {
  dt = new Date(dt);
  return `${
    (dt.getMonth()+1).toString().padStart(2, '0')}/${
    dt.getDate().toString().padStart(2, '0')}/${
    dt.getFullYear().toString().padStart(4, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`
}


const socket = io(`http://${appHost}:3001`,{transports: ['websocket', 'polling', 'flashsocket']});
const socket2 = io(`http://192.168.43.45:3001`,{transports: ['websocket', 'polling', 'flashsocket']});
// const socket = io(`http://9d75c3b4bafa.ngrok.io`,{transports: ['websocket', 'polling', 'flashsocket']});


const updateDeviceInfo = () => {
  const deviceElement = document.getElementsByName("device");
  deviceElement.forEach((dE)=>{
    socket.emit("request-device-info",{roomId, deviceId: dE.id});
  })
}
// setTimeout(()=>{
//   setInterval(()=>{
//     const deviceElement = document.getElementsByName("device");
//     deviceElement.forEach((dE)=>{
//       socket.emit("request-device-info",{roomId, deviceId: dE.id});
//     })
//   }, 1000)
// },1000)
socket.on("connect", async () => {
  console.log('connect');
  await getHomeInfo().then((response => {
    const info = response.result[0];
    roomId = info["id"];
    socket.emit("join-room",{roomId:info["id"]});

  }));
  socket.on("update-device-info",()=>{
    updateDeviceInfo();
  })


  // console.log({
  //   task: "connect",
  // });
  // await getHomeInfo().then((response => {
  //   console.log(response)
  //   const info = response.result[0];
  //   socket.emit("join-room",{roomId:info["id"]});
  //
  // }))

  socket.on ("response-device-info",(data)=>{
    // console.log({
    //   task:"response-device-info",
    //   data
    // });
    if (data && data[0] && data[0].type) {

      if (data[0].type === 'remote' && data[0]) {
        const element = document.getElementById(data[0].deviceId);
        element.checked = data[0].mode;
      }
      if (data[0].hasOwnProperty('h') && data[0].hasOwnProperty('t') && data[0].type === 'automatic') {
        const t = document.getElementById(`${data[0].deviceId}-t`);
        const h = document.getElementById(`${data[0].deviceId}-h`);
        t.innerText = data[0].t + '°C';
        h.innerText = data[0].h + '%';
      }
      if (data[0].type === 'warning') {
        const element = document.getElementById(`${data[0].deviceId}`);
        element.innerHTML = `<div id="${data[0].deviceId}"></div>`;
        let checkFirstValue = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].mode) {

            //<div role="alert" class="alert alert-primary">
            //                                         A simple primary alert—check it out!
            //                                     </div>
            const div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add("alert-primary");
            const datetime = strTime(data[i].datetime);
            div.textContent =  `${datetime} Motion was detected`;
            element.appendChild(div)
            if (checkFirstValue === 0 && Number(data[i].datetime) > datetimeLast) {
              datetimeLast = Number(data[i].datetime)
              pushNotification()
              console.log('run  pushNotification');
            }
            checkFirstValue = 1;
          }
        }
      }
    }
  })
});

class Room {
  constructor({id,name, homeId, home}) {
    this.id = id || null;
    this.name = name || null;
    this.homeId = homeId || null;
    this.home = home || null;
    this.path = `${endpoint}/rooms`;
    this.list = null;
  }
  async getList () {
    return new Promise((resolve, reject)=>{
      try {
        $.ajax(this.path,{
          method: 'get',
          headers: {
            'token': token
          },
          success: function (data, status, xhr) {
            return resolve(data);
          }
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  async getOne () {
    return new Promise((resolve, reject)=>{
      try {
        $.ajax({
          url: `${this.path}/${this.id}`,
          method: 'get',
          headers: {
            'token': token
          },
          success: function (data, status, xhr) {
            return resolve(data);
          }
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  async update (data) {
    return new Promise((resolve, reject)=>{
      try {
        $.ajax({
          url: `${this.path}/${this.id}`,
          method: 'put',
          data,
          dataType: 'json',
          headers: {
            'token': token
          },
          success: function (data, status, xhr) {
            return resolve(data);
          }
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
}

setTimeout(()=>{

  const deviceElement = document.getElementsByName("device");
  deviceElement.forEach((dE)=>{
    socket.emit("request-device-info",{roomId, deviceId: dE.id});
  })
},2000)
