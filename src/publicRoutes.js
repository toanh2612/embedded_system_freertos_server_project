import loginRoute from "./public/routes/loginRoute";
import { Router } from 'express';
const route = Router();
route.use("/login", loginRoute);
export default route;
