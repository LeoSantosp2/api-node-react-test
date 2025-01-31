import { Response } from 'express';
import { v4 } from 'uuid';

import prisma from '../config/prisma';

import { RequestProps } from '../interfaces/request-props';
import { RentedBooksBodyProps } from '../interfaces/rented-books-body-props';

class RentedBooksController {
  async index(req: RequestProps, res: Response) {
    try {
      const rentedBooks = await prisma.rentedBooks.findMany();

      return res.status(200).json(rentedBooks);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async show(req: RequestProps, res: Response) {
    try {
      const { clientId } = req.params;

      const rentedBooks = await prisma.rentedBooks.findMany({
        where: { client_id: clientId },
      });

      return res.status(200).json(rentedBooks);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async store(req: RequestProps<RentedBooksBodyProps>, res: Response) {
    try {
      const { cpf, copy_code, limit_date, rent_date, status } = req.body;

      if (!cpf || !copy_code || !limit_date || !rent_date || !status) {
        return res
          .status(400)
          .json({ error: 'Os campos não podem estar vazios.' });
      }

      const client = await prisma.clients.findFirst({
        select: { id: true, name: true },
        where: { cpf },
      });

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      const bookCopy = await prisma.booksCopy.findFirst({
        where: { copy_code },
      });

      if (!bookCopy) {
        return res.status(404).json({ error: 'Cópia não encontrada.' });
      }

      if (bookCopy.status === 'Alugado') {
        return res.status(400).json({ error: 'Cópia já está alugada.' });
      }

      const newRentedBook = {
        id: v4(),
        client_id: client.id,
        copy_code,
        rent_date: new Date(rent_date),
        limit_date: new Date(limit_date),
        status,
      };

      await prisma.rentedBooks.create({ data: newRentedBook });
      await prisma.booksCopy.update({
        data: { status: 'Alugado' },
        where: { copy_code },
      });

      return res.status(201).json('Livro alugado com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: RequestProps<RentedBooksBodyProps>, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { copyCode } = req.query;

      if (!status) {
        return res
          .status(400)
          .json({ error: 'Os campos não podem estar vazios.' });
      }

      const rentedBook = await prisma.rentedBooks.findFirst({
        where: { id },
      });

      if (!rentedBook) {
        return res.status(404).json({ error: 'Aluguel não encontrado.' });
      }

      await prisma.rentedBooks.update({
        data: { return_date: new Date(), status },
        where: { id },
      });

      await prisma.booksCopy.update({
        data: { status: 'Disponível' },
        where: { copy_code: copyCode },
      });

      return res.status(200).json('Aluguel finalizado com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new RentedBooksController();
