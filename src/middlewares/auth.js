import jwt from 'jsonwebtoken';
import CONFIG from "../config";
export default {
  authenticator: (req, res, next) => {
    try {
      const {token} = res.locals;
      jwt.verify(token, CONFIG['JWT_SECRET_KEY'], {algorithm: ['RS256']}, function (error, payload) {
        if (error) {
          throw error
        }
        return next();
      })
    } catch (error) {
      throw error
    }
  }
}
