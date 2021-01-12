import { Router } from 'express';
import roomRoute from './frontEndRoutes/roomRoute';
import loginRoute from './frontEndRoutes/loginRoute'
import deviceRoute from './frontEndRoutes/deviceRoute';


const route = Router();

route.use("/rooms", roomRoute);
route.use("/login", loginRoute);
// route.use("/devices", deviceRoute);


export default route;
