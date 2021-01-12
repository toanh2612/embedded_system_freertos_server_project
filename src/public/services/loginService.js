import { home } from '../../models/index';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import CONFIG from "../../config";
export default (param) => {
  return new Promise(async (resolve, reject)=>{
    try {
      const { entity } = param;
      if (!entity.username || !entity.password) {
        return reject("username, password isn\'t");
      }else {
        const { username, password } = entity;
        const homeFound = await home.findOne({
          where: {
            username
          }
        });
        if (homeFound) {
          const hash = ( homeFound && homeFound['password'] ) || '';
          await bcrypt.compare(password, hash).then(async (compareHashResult) => {
            if (!compareHashResult) {
              return reject("Password isn't valid")
            } else {
              const token = jwt.sign({ username, password}, CONFIG["JWT_SECRET_KEY"]);
              return resolve({
                token
              });
            }
          }).catch(compareError => {
            return reject(compareError)
          })
        } else {
          return reject("username not found");
        }
      }
    } catch (error) {
        return reject(error)
    }
  });
}
