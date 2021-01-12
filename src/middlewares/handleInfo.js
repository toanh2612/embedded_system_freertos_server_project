export default {
  getToken: (req, res, next) => {
    res.locals.token = ( req.headers && req.headers['token'] ) ? req.headers['token'] : ( req.query && req.query['token'] ) ? req.query['token'] : '';
    return next();
  }
}
