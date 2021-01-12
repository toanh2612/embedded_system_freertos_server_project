import { Router } from 'express';

const route = Router();

route.get("/");
route.get("/:id");


export default route;

