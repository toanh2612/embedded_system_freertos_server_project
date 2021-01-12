import { Router } from 'express';

const route = Router();

route.get("/", (req, res)=>{
  res.cookie = {};
  res.render('login')
});


export default route;

