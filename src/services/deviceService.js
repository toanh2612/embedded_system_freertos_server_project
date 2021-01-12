import { device, deviceType, room } from '../models/index'

export default {
  create: async (param) =>{
    const { entity } = param;
    try {
      return await device.create(entity);
    } catch (error) {
      throw error
    }
  },

  getAll: async (param) =>{
    const { filter } = param;
    try {
      return await device.findAll({
        where: filter,
        include: [{
          model: deviceType,
          as: 'deviceType'
        },
          {
            model: room,
            as: 'room'
          }
        ]
        // order
      }).catch((error)=> {
        throw error;
      })
    } catch (error) {
      throw error
    }
  },

  getOne: async (param) =>{
    const { id } = param;
    try {
      return await device.findOne({
        where: {
          id
        },
        include: [{
          model: deviceType,
          as: 'deviceType'
        },
          {
            model: room,
            as: 'room'
          }]
        // order
      }).catch((error)=> {
        throw error;
      })
    } catch (error) {
      throw error
    }
  },

  destroy: async (param) =>{
    const { id } = param;
    try {
      return await device.destroy({
        where: {
          id
        },
        // order
      }).catch((error)=> {
        throw error;
      })
    } catch (error) {
      throw error
    }
  },

  update: async (param)=> {
    try {
      const { entity, id } = param
      await device.update(entity,{
        where: {
          id
        }
      })

      return await device.findOne({
        where: {
          id: id || -1
        },
        include: [{
          model: deviceType,
          as: 'deviceType'
        },
          {
            model: room,
            as: 'room'
          }]
        // order
      })
    } catch (error){
      throw error
    }
  },
}
