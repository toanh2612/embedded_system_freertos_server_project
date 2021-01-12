import roomController from "../controllers/roomController";
import { Router } from 'express';

const route = Router();

route.get("/", roomController.getAll);
route.get("/:id", roomController.getOne);
route.post("/", roomController.post);
route.put("/:id", roomController.put);
route.delete("/:id", roomController.delete);

export default route;

