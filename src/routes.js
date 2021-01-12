import { Router } from 'express';

import homeRoute from './routes/homeRoute';
import roomRoute from './routes/roomRoute';
import deviceRoute from './routes/deviceRoute';
import deviceTypeRoute from './routes/deviceTypeRoute';

const route = Router();

route.use("/homes", homeRoute);
route.use("/rooms", roomRoute);
route.use("/devices", deviceRoute);
route.use("/deviceTypes",deviceTypeRoute);

export default route;
