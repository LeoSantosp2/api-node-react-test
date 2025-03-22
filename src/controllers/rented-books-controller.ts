import { Response } from 'express';
import { v4 } from 'uuid';

import prisma from '../config/prisma';

import { RequestProps } from '../interfaces/request-props';
import { RentedBooksBodyProps } from '../interfaces/rented-books-body-props';
import { RentedBooksProps } from '../interfaces/rented-books-props';

class RentedBooksController {
  async index(req: RequestProps, res: Response) {
    try {
      const { q, page, limit, status, withdrawal } = req.query;

      let rentedBooks: RentedBooksProps[] = [];
      let total = 0;

      const client = await prisma.clients.findFirst({
        select: { id: true, name: true },
        where: {
          OR: [{ cpf: q ? q : '' }, { name: q ? { contains: q } : '' }],
        },
      });

      const book = await prisma.books.findFirst({
        select: {
          id: true,
          title: true,
          BooksCopy: { select: { book_id: true, copy_code: true } },
        },
        where: { title: q ? { contains: q } : '' },
      });

      // Data de Retirada AND Nome do Cliente/CPF
      if (withdrawal && client) {
        rentedBooks = await prisma.rentedBooks.findMany({
          skip: Number(page),
          take: Number(limit),
          orderBy: { client: { name: 'asc' } },
          select: {
            id: true,
            rent_date: true,
            limit_date: true,
            status: true,
            client: { select: { name: true } },
            books_copy: {
              select: { copy_code: true, book: { select: { title: true } } },
            },
          },
          where: {
            AND: [
              { rent_date: new Date(withdrawal) },
              {
                client: {
                  OR: [{ cpf: q }, { name: { contains: q } }],
                },
              },
              { status },
            ],
          },
        });

        total = await prisma.rentedBooks.count({
          where: {
            AND: [
              { rent_date: new Date(withdrawal) },
              {
                client: {
                  OR: [{ cpf: q }, { name: { contains: q } }],
                },
              },
              { status },
            ],
          },
        });

        return res.status(200).json({ data: rentedBooks, total: total });
      }

      // Data de Retirada AND Títutlo do Livro
      if (withdrawal && book) {
        rentedBooks = await prisma.rentedBooks.findMany({
          skip: Number(page),
          take: Number(limit),
          orderBy: { client: { name: 'asc' } },
          select: {
            id: true,
            rent_date: true,
            limit_date: true,
            status: true,
            client: { select: { name: true } },
            books_copy: {
              select: { copy_code: true, book: { select: { title: true } } },
            },
          },
          where: {
            AND: [
              { rent_date: new Date(withdrawal) },
              {
                books_copy: { book: { title: { contains: q } } },
              },
              { status },
            ],
          },
        });

        total = await prisma.rentedBooks.count({
          where: {
            AND: [
              { rent_date: new Date(withdrawal) },
              {
                books_copy: { book: { title: { contains: q } } },
              },
              { status },
            ],
          },
        });

        return res.status(200).json({ data: rentedBooks, total: total });
      }

      if (client) {
        rentedBooks = await prisma.rentedBooks.findMany({
          skip: Number(page),
          take: Number(limit),
          orderBy: { client: { name: 'asc' } },
          select: {
            id: true,
            rent_date: true,
            limit_date: true,
            status: true,
            client: { select: { name: true } },
            books_copy: {
              select: { copy_code: true, book: { select: { title: true } } },
            },
          },
          where: { client_id: client.id, status },
        });

        total = await prisma.rentedBooks.count({
          where: { client_id: client.id, status },
        });

        return res.status(200).json({ data: rentedBooks, total: total });
      }

      if (book) {
        rentedBooks = await prisma.rentedBooks.findMany({
          skip: Number(page),
          take: Number(limit),
          orderBy: { client: { name: 'asc' } },
          select: {
            id: true,
            rent_date: true,
            limit_date: true,
            status: true,
            client: { select: { name: true } },
            books_copy: {
              select: { copy_code: true, book: { select: { title: true } } },
            },
          },
          where: {
            books_copy: { book: { title: { contains: book.title } } },
            status,
          },
        });

        total = await prisma.rentedBooks.count({
          where: {
            books_copy: { book: { title: { contains: book.title } }, status },
            status,
          },
        });

        return res.status(200).json({ data: rentedBooks, total: total });
      }

      if (withdrawal) {
        rentedBooks = await prisma.rentedBooks.findMany({
          skip: Number(page),
          take: Number(limit),
          orderBy: { client: { name: 'asc' } },
          select: {
            id: true,
            rent_date: true,
            limit_date: true,
            status: true,
            client: { select: { name: true } },
            books_copy: {
              select: { copy_code: true, book: { select: { title: true } } },
            },
          },
          where: { rent_date: new Date(withdrawal), status },
        });

        total = await prisma.rentedBooks.count({
          where: { rent_date: new Date(withdrawal), status },
        });

        return res.status(200).json({ data: rentedBooks, total: total });
      }

      rentedBooks = await prisma.rentedBooks.findMany({
        skip: Number(page),
        take: Number(limit),
        orderBy: { client: { name: 'asc' } },
        select: {
          id: true,
          rent_date: true,
          limit_date: true,
          status: true,
          client: { select: { name: true } },
          books_copy: {
            select: { copy_code: true, book: { select: { title: true } } },
          },
        },
        where: { status },
      });

      total = await prisma.rentedBooks.count({
        where: { status },
      });

      return res.status(200).json({ data: rentedBooks, total: total });
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

      const clientWasLateTwice = await prisma.rentedBooks.findMany({
        select: {
          id: true,
          client_id: true,
          late: true,
        },

        where: {
          AND: [{ client_id: client.id }, { late: 1 }],
        },
      });

      if (clientWasLateTwice.length >= 2) {
        return res.status(400).json({
          error:
            'Cliente atrasou a devolução 2x ou mais. Cliente não pode mais alugar livros.',
        });
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
      const { status, late } = req.body;
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
        data: { return_date: new Date(), status, late },
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
