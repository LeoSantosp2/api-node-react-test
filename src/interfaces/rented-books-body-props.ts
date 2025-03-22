export interface RentedBooksBodyProps {
  cpf: string;
  copy_code: string;
  rent_date: string;
  return_date: string;
  limit_date: string;
  status: 'Ativo' | 'Concluído';
  late: 0 | 1;
}
