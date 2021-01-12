import deviceTypeController from "../controllers/deviceTypeController";

import { Router } from 'express';

const route = Router();

route.get("/", deviceTypeController.getAll);
route.get("/:id", deviceTypeController.getOne);
route.post("/", deviceTypeController.post);
route.put("/:id", deviceTypeController.put);
route.delete("/:id", deviceTypeController.delete);

export default route;

