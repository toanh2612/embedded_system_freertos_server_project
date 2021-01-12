import { room, home, device, deviceType} from '../models/index'

export default {
  create: async (param) =>{
    const { entity } = param;
    try {
      return await room.create(entity);
    } catch (error) {
      throw error
    }
  },

  getAll: async (param) =>{
    const { filter } = param;
    try {
      return await room.findAll({
        where: filter,
        include: [{
          model: home,
          as: 'home',
          attributes: { exclude: ['password'] }
        },{
          model: device,
          as: 'devices',
          include: [
            {
              model: deviceType,
              as: 'deviceType'
            }
          ]
        }],

        // order
      })
    } catch (error) {
      throw error
    }
  },

  getOne: async (param) =>{
    const { id } = param;
    try {
      return await room.findOne({
        where: {
          id: id || -1
        },
        include: [{
          model: home,
          as: 'home',
          attributes: { exclude: ['password'] }
        },{
          model: device,
          as: 'devices',
          include: [
            {
              model: deviceType,
              as: 'deviceType'
            }
          ]
        }],
        // order
      })
    } catch (error) {
      throw error
    }
  },

  destroy: async (param) =>{
    const { id } = param;
    try {
      return await room.destroy({
        where: {
          id
        },
        // order
      })
    } catch (error) {
      throw error
    }
  },
  update: async (param)=> {
    try {
      const { entity, id } = param
      await room.update(entity,{
        where: {
          id
        }
      })

      return await room.findOne({
        where: {
          id: id || -1
        },
        // order
      })
    } catch (error){
      throw error
    }
  }
}
