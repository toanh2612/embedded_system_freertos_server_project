import deviceTypeService from "../services/deviceTypeService";
import handleSuccess from "../helpers/handleSuccess";
export default {
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const param = { id }
      await deviceTypeService.getOne(param).then((result)=> {
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
      await deviceTypeService.getAll(param).then((result)=> {
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
      await deviceTypeService.create(param).then((result)=> {
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
      await deviceTypeService.destroy(param).then((result)=> {
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
      await deviceTypeService.update(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  }
}
