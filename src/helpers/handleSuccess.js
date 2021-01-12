export default (option,req, res, next) => {
  option = (typeof option ===  'object') ? option  : {};
  return res.json({
    ...option
  })
}
