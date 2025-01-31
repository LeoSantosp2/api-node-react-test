import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import employeesRouter from './routes/employees-route';
import booksRouter from './routes/books-route';
import booksCopyRouter from './routes/books-copy-route';
import clientsRouter from './routes/clients-route';
import rentedBooksRouter from './routes/rented-books-route';
import loginRouter from './routes/login-route';

const corsOptions = {
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200,
};

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
    this.app.use(cors(corsOptions));
  }

  routes() {
    this.app.use('/employees', employeesRouter);
    this.app.use('/books', booksRouter);
    this.app.use('/books-copy', booksCopyRouter);
    this.app.use('/clients', clientsRouter);
    this.app.use('/rented-books', rentedBooksRouter);
    this.app.use('/login', loginRouter);
  }
}

export default new App().app;
