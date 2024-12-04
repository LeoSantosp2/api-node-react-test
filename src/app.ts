import express from 'express';
import 'dotenv/config';

import employeesRouter from './routes/employees-route';
import booksRouter from './routes/books-route';
import booksCopyRouter from './routes/books-copy-router';

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
    this.app.use('/books', booksRouter);
    this.app.use('/books-copy', booksCopyRouter);
  }
}

export default new App().app;
