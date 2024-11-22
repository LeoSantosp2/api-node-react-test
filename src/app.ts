import express from 'express';

class App {
  public app: express.Application;

  constructor() {
    this.app = express.application;
    this.middlewares();
    this.routes();
  }

  middlewares() { }

  routes() { }
}

export default new App().app;
