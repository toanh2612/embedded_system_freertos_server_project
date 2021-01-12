import { Router } from 'express';
import roomRoute from './frontEndRoutes/roomRoute';
import deviceRoute from './frontEndRoutes/deviceRoute';


const route = Router();

route.use("/rooms", roomRoute);
route.use("/devices", deviceRoute);


export default route;
