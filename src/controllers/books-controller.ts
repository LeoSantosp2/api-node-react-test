import { Response } from 'express';
import { v4 } from 'uuid';

import prisma from '../config/prisma';

import { RequestProps } from '../interfaces/request-props';
import { BooksBodyProps } from '../interfaces/books-body-props';
import { BooksProps } from '../interfaces/books-props';

class BooksController {
  async index(req: RequestProps, res: Response) {
    try {
      const { page, limit, status, q } = req.query;

      let books: BooksProps[] = [];
      let totalBooks: number = 0;

      if (!page || !limit) {
        return res
          .status(400)
          .json({ error: 'Necessário inserir na URL, o page e limit.' });
      }

      if (q && status) {
        books = await prisma.booksCopy.findMany({
          take: Number(limit),
          skip: Number(page),
          orderBy: { book: { title: 'asc' } },
          select: {
            id: true,
            copy_code: true,
            status: true,
            book: {
              select: { id: true, title: true, author: true, isbn: true },
            },
          },
          where: {
            AND: [
              { book: { OR: [{ title: q }, { author: q }, { isbn: q }] } },
              { status },
            ],
          },
        });

        totalBooks = await prisma.booksCopy.count({
          where: {
            AND: [
              { book: { OR: [{ title: q }, { author: q }, { isbn: q }] } },
              { status },
            ],
          },
        });

        return res.status(200).json({ data: books, total: totalBooks });
      }

      if (q) {
        books = await prisma.booksCopy.findMany({
          take: Number(limit),
          skip: Number(page),
          orderBy: { book: { title: 'asc' } },
          select: {
            id: true,
            copy_code: true,
            status: true,
            book: {
              select: { id: true, title: true, author: true, isbn: true },
            },
          },
          where: {
            book: { OR: [{ title: q }, { author: q }, { isbn: q }] },
          },
        });

        totalBooks = await prisma.booksCopy.count({
          where: {
            book: { OR: [{ title: q }, { author: q }, { isbn: q }] },
          },
        });

        return res.status(200).json({ data: books, total: totalBooks });
      }

      if (status) {
        books = await prisma.booksCopy.findMany({
          take: Number(limit),
          skip: Number(page),
          orderBy: { book: { title: 'asc' } },
          select: {
            id: true,
            copy_code: true,
            status: true,
            book: {
              select: { id: true, title: true, author: true, isbn: true },
            },
          },
          where: {
            status,
          },
        });

        totalBooks = await prisma.booksCopy.count({
          where: {
            status,
          },
        });

        return res.status(200).json({ data: books, total: totalBooks });
      }

      books = await prisma.booksCopy.findMany({
        take: Number(limit),
        skip: Number(page),
        orderBy: { book: { title: 'asc' } },
        select: {
          id: true,
          copy_code: true,
          status: true,
          book: {
            select: { id: true, title: true, author: true, isbn: true },
          },
        },
      });

      totalBooks = await prisma.booksCopy.count();

      return res.status(200).json({ data: books, total: totalBooks });
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async store(req: RequestProps<BooksBodyProps>, res: Response) {
    try {
      const { title, author, isbn, copy_code } = req.body;

      if (!title || !author || !isbn || !copy_code) {
        return res
          .status(400)
          .json({ error: 'Os campos não podem estar vazios.' });
      }

      const bookExists = await prisma.books.findFirst({
        select: { isbn: true },
        where: { isbn },
      });

      const copyExists = await prisma.booksCopy.findFirst({
        select: { copy_code: true },
        where: { copy_code },
      });

      if (bookExists) {
        return res.status(400).json({ error: 'ISBN já cadastrado.' });
      }

      if (copyExists) {
        return res.status(400).json({ error: 'Cópia já cadastrada.' });
      }

      const newBook = {
        id: v4(),
        title,
        author,
        isbn,
      };

      const newBookCopy = {
        id: v4(),
        book_id: newBook.id,
        copy_code,
        status: 'available',
      };

      await prisma.books.create({ data: newBook });
      await prisma.booksCopy.create({ data: newBookCopy });

      return res.status(201).json('Livro adicionado ao sistema com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: RequestProps<BooksBodyProps>, res: Response) {
    try {
      const { id } = req.params;

      const book = await prisma.books.findFirst({
        select: { title: true, author: true, isbn: true },
        where: { id },
      });

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      if (book.title !== req.body.title) {
        await prisma.books.update({
          data: { title: req.body.title },
          where: { id },
        });
      }

      if (book.author !== req.body.author) {
        await prisma.books.update({
          data: { author: req.body.author },
          where: { id },
        });
      }

      if (book.isbn !== req.body.isbn) {
        await prisma.books.update({
          data: { isbn: req.body.isbn },
          where: { id },
        });
      }

      return res.status(200).json('Dados atualizado com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async delete(req: RequestProps, res: Response) {
    try {
      const { id } = req.params;

      const bookExists = await prisma.books.findFirst({ where: { id } });

      if (!bookExists) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      await prisma.books.delete({ where: { id } });

      return res.status(200).json('Livro excluido com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new BooksController();
