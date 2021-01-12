import { home, room  } from '../models/index'

export default {
  create: async (param) =>{
    const { entity } = param;
    try {
      return await home.create(entity);
    } catch (error) {
      throw error
    }
  },

  getAll: async (param) =>{
    const { filter } = param;
    try {
      return await home.findAll({
        where: filter,
        attributes: { exclude: ['password'] },
        include: [{
          model: room,
          as: 'rooms'
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
      return await home.findOne({
        where: {
          id: id || -1
        },
        attributes: { exclude: ['password'] },
        include: [{
          model: room,
          as: 'rooms'
        }]
        // order
      })
    } catch (error) {
      throw error
    }
  },

  destroy: async (param) =>{
    const { id } = param;
    try {
      return await home.destroy({
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
      await home.update(entity,{
        where: {
          id
        },
      })
      return await home.findOne({
        where: {
          id: id || -1
        },
        attributes: { exclude: ['password'] }
        // order
      })
    } catch (error){
      throw error
    }
  }
}
