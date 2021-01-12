import {deviceType, home} from '../models/index'

export default {
  create: async (param) =>{
    const { entity } = param;
    try {
      return await deviceType.create(entity);
    } catch (error) {
      throw error
    }
  },

  getAll: async (param) =>{
    const { filter } = param;
    try {
      return await deviceType.findAll({
        where: filter,
        // order
      })
    } catch (error) {
      throw error
    }
  },

  getOne: async (param) =>{
    const { id } = param;
    try {
      return await deviceType.findOne({
        where: {
          id: id || -1
        },
        // order
      })
    } catch (error) {
      throw error
    }
  },

  destroy: async (param) =>{
    const { id } = param;
    try {
      return await deviceType.destroy({
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
      await deviceType.update(entity,{
        where: {
          id
        }
      })

      return await deviceType.findOne({
        where: {
          id: id || -1
        },
        // order
      })
    } catch (error){
      throw error
    }
  },

}
