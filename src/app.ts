import express from 'express';
import 'dotenv/config';

import employeesRouter from './routes/employees-route';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/employees', employeesRouter);
  }
}

export default new App().app;
