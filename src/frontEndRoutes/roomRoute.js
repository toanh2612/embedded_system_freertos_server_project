import { Router } from 'express';

const route = Router();

route.get("/", (req, res)=>{
  res.render('rooms')

});
route.get("/:id");

export default route;

