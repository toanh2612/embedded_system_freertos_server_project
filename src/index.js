import express from "express";
import bodyParser from 'body-parser';
import morgan from 'morgan';
import CONFIG from "./config";
require("./db/rethinkDb");
require("./rabbitMqRuntime")
import handleInfo from "./middlewares/handleInfo";
const { getToken } = handleInfo;
const app = express();
import routes from './routes';
import frontEndRoutes from './frontEndRoutes';
import publicRoutes from './publicRoutes'
import handleError from "./errors/handleError";
import auth from "./middlewares/auth";
import path from "path";
import cors from 'cors';
import mqttServer from './mqttServer';
const { authenticator } = auth;

const webpush = require('web-push');
const publicVapidKey = CONFIG['PUBLIC_VAPID_KEY'];
const privateVapidKey = CONFIG['PRIVATE_VAPID_KEY'];
webpush.setVapidDetails('mailto:toanhkma@gmail.com', publicVapidKey, privateVapidKey);

app.use(express.static(path.resolve(process.cwd(),'front-end')));
app.set('views', path.resolve(process.cwd(),'src','views'));
app.set('view engine', 'ejs');

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
    allowedHeaders: [
      'Service-Worker-Allowed',
      'Content-Type',
      'Cache-Control',
      'X-Requested-With',
      'X-Auth-Key',
      'X-Auth-Email',
      'authorization',
      'username',
      'token'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600
  })
);


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(getToken);

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' });

  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

app.get("/test", async (req, res)=> {
  return res.json({
    message: "hello"
  });
});
app.use("/api/public",publicRoutes);
// app.use(authenticator);
app.use("/",frontEndRoutes);
app.use("/api", routes);


app.use(handleError);

app.listen( Number(CONFIG["APP_PORT"] || 5000), String(CONFIG["APP_HOST"] || '0.0.0.0'), function () {
  console.log(CONFIG["APP_PORT"], CONFIG["APP_HOST"]);
})
