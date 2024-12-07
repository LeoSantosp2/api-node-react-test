import { Request } from 'express';

export interface RequestProps<T = undefined> extends Request {
  params: {
    id: string;
    bookId: string;
    copyCode: string;
    clientId: string;
  };

  body: T;
}
