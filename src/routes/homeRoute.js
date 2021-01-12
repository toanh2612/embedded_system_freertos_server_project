import homeController from "../controllers/homeController";
import { Router } from 'express';

const route = Router();

route.get("/", homeController.getAll);
route.get("/:id", homeController.getOne);
route.post("/", homeController.post);
route.put("/:id", homeController.put);
route.delete("/:id", homeController.delete);

export default route;

