import { Request } from 'express';

export interface RequestProps<T = undefined> extends Request {
  params: {
    id: string;
  };

  body: T;
}
