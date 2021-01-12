import deviceController from "../controllers/deviceController";
import { Router } from 'express';

const route = Router();

route.get("/", deviceController.getAll);
route.get("/:id", deviceController.getOne);
route.post("/", deviceController.post);
route.put("/:id", deviceController.put);
route.delete("/:id", deviceController.delete);

export default route;

