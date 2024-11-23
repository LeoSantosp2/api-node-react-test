import isEmail from 'validator/lib/isEmail';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import { hashSync } from 'bcrypt';

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

      return res.status(200).json('Usuário cadastrado com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new EmployeesController();
