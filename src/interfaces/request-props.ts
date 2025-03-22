import { Request } from 'express';

export interface RequestProps<T = undefined> extends Request {
  params: {
    id: string;
    bookId: string;
    copyCode: string;
    clientId: string;
  };

  query: {
    page: string;
    limit: string;
    copyCode: string;
    status: string;
    withdrawal: string;
    month: string;
    year: string;
    city: string;
    q: string;
  };

  body: T;
}
