import loginController from "../controllers/loginController";
import { Router } from 'express';

const route = Router();

route.post("/", loginController.post);

export default route;

