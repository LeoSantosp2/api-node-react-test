import { Response } from 'express';

import prisma from '../config/prisma';

import { RequestProps } from '../interfaces/request-props';
import { LateRentPaymentsProps } from '../interfaces/late-rent-payments-props';

class ReportsController {
  async index(req: RequestProps, res: Response) {
    try {
      const { month, year, city } = req.query;

      let lateRentPayments: LateRentPaymentsProps[] = [];
      let initialDate = '';
      let endDate = '';

      if (!month || !year) {
        return res
          .status(400)
          .json({ error: 'Os campos de mês e ano não podem estar vazios.' });
      }

      switch (month) {
        case 'Janeiro':
          initialDate = `${year}` + '-01-01';
          endDate = `${year}` + '-01-31';

          break;

        case 'Fevereiro':
          initialDate = `${year}` + '-02-01';
          endDate = `${year}` + '-02-28';

          break;

        case 'Março':
          initialDate = `${year}` + '-03-01';
          endDate = `${year}` + '-03-31';

          break;

        case 'Abril':
          initialDate = `${year}` + '-04-01';
          endDate = `${year}` + '-04-30';

          break;

        case 'Maio':
          initialDate = `${year}` + '-05-01';
          endDate = `${year}` + '-05-31';

          break;

        case 'Junho':
          initialDate = `${year}` + '-06-01';
          endDate = `${year}` + '-06-30';

          break;

        case 'Julho':
          initialDate = `${year}` + '-07-01';
          endDate = `${year}` + '-07-31';

          break;

        case 'Agosto':
          initialDate = `${year}` + '-08-01';
          endDate = `${year}` + '-08-31';

          break;

        case 'Setembro':
          initialDate = `${year}` + '-09-01';
          endDate = `${year}` + '-09-30';

          break;

        case 'Outubro':
          initialDate = `${year}` + '-10-01';
          endDate = `${year}` + '-10-31';

          break;

        case 'Novembro':
          initialDate = `${year}` + '-11-01';
          endDate = `${year}` + '-11-30';

          break;

        case 'Dezembro':
          initialDate = `${year}` + '-12-01';
          endDate = `${year}` + '-12-31';

          break;

        default:
          initialDate = `${year}` + '-01-01';
          endDate = `${year}` + '-01-31';
      }

      if (city) {
        const mostRentedBooksByCity =
          await prisma.$queryRaw`SELECT b.title FROM Books b
        LEFT JOIN BooksCopy bc ON b.id = bc.book_id
        LEFT JOIN RentedBooks rb ON rb.copy_code = bc.copy_code
        LEFT JOIN Clients c ON rb.client_id = c.id
        WHERE rb.rent_date BETWEEN ${initialDate} AND ${endDate} AND
        c.city_address=${city}
        GROUP BY b.title
        ORDER BY COUNT(b.title) DESC
        LIMIT 3`;

        return res.status(200).json(mostRentedBooksByCity);
      }

      lateRentPayments = await prisma.$queryRaw`SELECT b.title FROM Books b
        LEFT JOIN BooksCopy bc ON b.id = bc.book_id LEFT JOIN RentedBooks rb ON bc.copy_code = rb.copy_code
        WHERE rb.late=1 AND rb.rent_date BETWEEN ${initialDate} AND ${endDate}
        GROUP BY b.title ORDER BY COUNT(b.title) DESC LIMIT 3`;

      return res.status(200).json(lateRentPayments);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async show(req: RequestProps, res: Response) {
    try {
      const cities = await prisma.clients.groupBy({
        by: ['city_address'],
        orderBy: { city_address: 'asc' },
      });

      return res.status(200).json(cities);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new ReportsController();
