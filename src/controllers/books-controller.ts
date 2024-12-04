import { Response } from 'express';
import { v4 } from 'uuid';

import prisma from '../config/prisma';

import { RequestProps } from '../interfaces/request-props';
import { BooksBodyProps } from '../interfaces/books-body-props';

class BooksController {
  async index(req: RequestProps, res: Response) {
    try {
      const books = await prisma.books.findMany();

      return res.status(200).json(books);
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
