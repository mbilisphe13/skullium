import "./bootstrap"
import express, { Request, Response } from 'express';
import { inertia, listen } from '@skull/inertia';
import { database, bootRoutes, AuthModel } from "@skull/core";
import { User } from "./models/user";

const app = express();

const inertiMiddleware = inertia()

database.initialize().then(() => console.log('Database connected!'));

app.use(express.json());
app.set('views', 'src/client/views')
app.set('view engine', 'hbs')

bootRoutes(
  User as any,
  [
    inertia(async (req:Request) => ({
     auth: { user: req.user?.only(['id', 'firstName', 'lastName']) } 
    }))
  ]
).then(({apiRouter, webRouter}) =>{
  app.use('/api', apiRouter)
  app.use('/', webRouter)

  listen(app, 3000, () => { console.log(`Server is running on port 3000`)})
})
