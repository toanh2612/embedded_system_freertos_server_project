import loginService from "../services/loginService";

import handleSuccess from "../../helpers/handleSuccess";
import handleError from "../../errors/handleError";
export default {
  post: async (req, res, next) => {
    try {
      const entity = req.body;
      const param = { entity }
      await loginService(param).then((result)=>{
        console.log(result);
        return handleSuccess({result}, req, res, next)
      }).catch((error)=>{
        console.log(error);
        return handleError(error, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  },
}
