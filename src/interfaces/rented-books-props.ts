export type RentedBooksProps = {
  id: string;
  rent_date: Date;
  limit_date: Date;
  status: string;
  client: {
    name: string;
  };
  books_copy: {
    copy_code: string;
    book: {
      title: string;
    };
  };
};
