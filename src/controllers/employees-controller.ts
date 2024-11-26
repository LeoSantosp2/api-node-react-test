import isEmail from 'validator/lib/isEmail';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import { hashSync, compareSync } from 'bcrypt';

import { RequestProps } from '../interfaces/request-props';
import { EmployeesBodyProps } from '../interfaces/employees-body-props';

const prisma = new PrismaClient();

class EmployeesController {
  async index(req: RequestProps, res: Response) {
    try {
      const employees = await prisma.employees.findMany();

      return res.status(200).json(employees);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async show(req: RequestProps, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.employees.findFirst({ where: { id } });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não existe.' });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async store(req: RequestProps<EmployeesBodyProps>, res: Response) {
    try {
      const { first_name, last_name, email, password, confirm_password } =
        req.body;

      if (
        !first_name ||
        !last_name ||
        !email ||
        !password ||
        !confirm_password
      ) {
        return res
          .status(400)
          .json({ error: 'Os campos não podem estar vazios.' });
      }

      if (!isEmail(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
      }

      const emailExists = await prisma.employees.findFirst({
        select: { email: true },
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      if (password !== confirm_password) {
        return res.status(400).json({ error: 'As senhas não são iguais.' });
      }

      if (password.length < 8 && confirm_password.length < 8) {
        return res
          .status(400)
          .json({ error: 'A senha deve ter no minimo 8 caracteres.' });
      }

      const newEmployeer = {
        id: v4(),
        first_name,
        last_name,
        email,
        password: hashSync(password, 8),
      };

      await prisma.employees.create({ data: newEmployeer });

      return res.status(201).json('Usuário cadastrado com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: RequestProps<EmployeesBodyProps>, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.employees.findFirst({
        where: { id },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          password: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não existe.' });
      }

      if (
        user.first_name !== req.body.first_name &&
        user.last_name !== req.body.last_name &&
        user.email !== req.body.email &&
        !compareSync(req.body.password, user.password)
      ) {
        if (!isEmail(req.body.email)) {
          return res.status(400).json({ error: 'E-mail inválido.' });
        }

        const emailExists = await prisma.employees.findFirst({
          select: { email: true },
          where: { email: req.body.email },
        });

        if (emailExists) {
          return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        if (
          req.body.password.length < 8 ||
          req.body.confirm_password.length < 8
        ) {
          return res
            .status(400)
            .json({ error: 'A senha deve ter no minímo 8 caracteres.' });
        }

        if (req.body.password !== req.body.confirm_password) {
          return res.status(400).json({ error: 'As senhas não são iguais.' });
        }

        await prisma.employees.update({
          data: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
          },

          where: { id },
        });

        return res.status(200).json('Dados atualizados com sucesso.');
      }

      if (user.first_name !== req.body.first_name) {
        await prisma.employees.update({
          data: { first_name: req.body.first_name },
          where: { id },
        });

        return res.status(200).json('Nome alterado com sucesso.');
      }

      if (user.last_name !== req.body.last_name) {
        await prisma.employees.update({
          data: { last_name: req.body.last_name },
          where: { id },
        });

        return res.status(200).json('Sobrenome alterado com sucesso.');
      }

      if (user.email !== req.body.email) {
        if (!isEmail(req.body.email)) {
          return res.status(400).json({ error: 'E-mail inválido.' });
        }

        const emailExists = await prisma.employees.findFirst({
          select: { email: true },
          where: { email: req.body.email },
        });

        if (emailExists) {
          return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        await prisma.employees.update({
          data: { email: req.body.email },
          where: { id },
        });

        return res.status(200).json('E-mail alterado com sucesso.');
      }

      if (!compareSync(req.body.password, user.password)) {
        if (
          req.body.password.length < 8 ||
          req.body.confirm_password.length < 8
        ) {
          return res
            .status(400)
            .json({ error: 'A senha deve ter no minímo 8 caracteres.' });
        }

        if (req.body.password !== req.body.confirm_password) {
          return res.status(400).json({ error: 'As senhas não são iguais.' });
        }

        await prisma.employees.update({
          data: { password: hashSync(req.body.password, 8) },
          where: { id },
        });

        return res.status(200).json('Senha alterada com sucesso.');
      }

      return res.status(200).json('Nada foi alterado.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async delete(req: RequestProps, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.employees.findFirst({ where: { id } });

      if (!user) {
        return res
          .status(400)
          .json({ error: 'Usuário não encontrado ou não existe.' });
      }

      await prisma.employees.delete({ where: { id } });

      return res.status(200).json('Usuário excluido com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new EmployeesController();
