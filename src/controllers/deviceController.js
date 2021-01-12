import deviceService from "../services/deviceService";
import handleSuccess from "../helpers/handleSuccess";
export default {
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const param = { id }
      await deviceService.getOne(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  },
  getAll: async (req, res, next) => {
    try {
      let { filter } = req.query;
      filter = filter || {};
      const param = { filter }
      await deviceService.getAll(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  },
  post: async (req, res, next) => {
    try {
      const entity = req.body;
      const param = { entity }
      await deviceService.create(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      }).catch((e)=>{
        next(e)
      })
    } catch (e) {
      next(e)
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const param = { id }
      await deviceService.destroy(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  },
  put: async (req, res, next) => {
    try {
      const entity = req.body;
      const { id } = req.params;
      const param = { id, entity };
      await deviceService.update(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  }
}
