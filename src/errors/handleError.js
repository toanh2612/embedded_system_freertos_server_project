import _ from "lodash";
export default (error, req, res, next) => {
  try {
    let errorResult = null;
    if (typeof error === 'string') {
      errorResult = error
    } else if (typeof error === 'object') {
      errorResult = { ..._.pick(error,Object.keys(error))};
    }

    return res.json({
      errorResult: errorResult || error || null
    })
  } catch (e) {
    console.log({
      error: e
    });
    res.json({
      errorResult: error || e || null
    }).status(500)
  }
}
