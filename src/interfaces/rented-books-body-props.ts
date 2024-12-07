export interface RentedBooksBodyProps {
  client_id: string;
  copy_code: string;
  rent_date: string;
  return_date: string;
  limit_date: string;
  status: 'active' | 'completed' | 'late';
}
