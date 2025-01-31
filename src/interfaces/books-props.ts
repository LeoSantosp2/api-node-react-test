interface BookProps {
  id: string;
  title: string;
  author: string;
  isbn: string;
}

export interface BooksProps {
  id: string;
  copy_code: string;
  status: string;
  book: BookProps;
}
