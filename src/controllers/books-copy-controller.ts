import { Response } from 'express';
import { v4 } from 'uuid';

import prisma from '../config/prisma';

import { RequestProps } from '../interfaces/request-props';
import { BookCopyBodyProps } from '../interfaces/book-copy-body-props';

class BooksCopyController {
  async index(req: RequestProps, res: Response) {
    try {
      const { bookId } = req.params;

      const copys = await prisma.booksCopy.findMany({
        where: { book_id: bookId },
      });

      return res.status(200).json(copys);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async store(req: RequestProps<BookCopyBodyProps>, res: Response) {
    try {
      const { bookId } = req.params;
      const { copy_code, status } = req.body;

      if (!copy_code || !status) {
        return res
          .status(400)
          .json({ error: 'Os campos não podem estar vazios.' });
      }

      const bookNotExists = await prisma.books.findFirst({
        select: { title: true },
        where: { id: bookId },
      });

      if (!bookNotExists) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
      }

      const copyCodeExists = await prisma.booksCopy.findFirst({
        select: { copy_code: true },
        where: { copy_code },
      });

      if (copyCodeExists) {
        return res
          .status(400)
          .json({ error: 'Código da cópia já registrado.' });
      }

      const newBookCopy = {
        id: v4(),
        book_id: bookId,
        copy_code,
        status,
      };

      await prisma.booksCopy.create({ data: newBookCopy });

      return res.status(201).json('Cópia adicionada ao sistema com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: RequestProps<BookCopyBodyProps>, res: Response) {
    try {
      const { copyCode } = req.params;
      const { status } = req.body;

      const copy = await prisma.booksCopy.findFirst({
        select: { copy_code: true, status: true },
        where: { copy_code: copyCode },
      });

      if (!copy) {
        return res.status(404).json({ error: 'Cópia não encontrada.' });
      }

      if (copy.status !== status) {
        await prisma.booksCopy.update({
          data: { status },
          where: { copy_code: copyCode },
        });
      }

      return res.status(200).json('Dados atualizado com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async delete(req: RequestProps, res: Response) {
    try {
      const { copyCode } = req.params;

      const copy = await prisma.booksCopy.findFirst({
        where: { copy_code: copyCode },
      });

      if (!copy) {
        return res.status(404).json({ error: 'Cópia não encontrada.' });
      }

      await prisma.booksCopy.delete({ where: { copy_code: copyCode } });

      return res.status(200).json('Cópia excluida com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new BooksCopyController();
