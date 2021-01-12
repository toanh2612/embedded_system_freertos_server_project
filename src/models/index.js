import device from "./device";
import home from "./home";
import room from "./room";
import deviceType from "./deviceType";

device.belongsTo(room,{
  foreignKey: "roomId",
  as: "room"
});

room.belongsTo(home,{
  foreignKey: "homeId",
  as: "home"
});

home.hasMany(room, {
  foreignKey: "homeId",
  as: "rooms"
});

room.hasMany(device, {
  foreignKey: "roomId",
  as: "devices"
});

device.belongsTo(deviceType, {
  foreignKey: "deviceTypeId",
  as: "deviceType"
})

export {
  device,
  room,
  home,
  deviceType
}
