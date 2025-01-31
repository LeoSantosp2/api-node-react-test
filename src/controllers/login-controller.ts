import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import { Response } from 'express';

import prisma from '../config/prisma';
import env from '../config/env';

import { passwordIsValid } from '../utils/password-is-valid';

import { RequestProps } from '../interfaces/request-props';
import { LoginBodyProps } from '../interfaces/login-body-props';

class LoginController {
  async store(req: RequestProps<LoginBodyProps>, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Os campos não podem estar vazios.' });
      }

      if (!isEmail(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
      }

      const employeer = await prisma.employees.findFirst({
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          password: true,
        },
        where: { email },
      });

      if (!employeer) {
        return res.status(404).json({ error: 'Funcionário não encontrado.' });
      }

      if (!(await passwordIsValid(employeer, password))) {
        return res.status(400).json({ error: 'Senha inválida.' });
      }

      const clientId = employeer.id;

      const token = jwt.sign({ clientId, email }, env.TOKEN_SECRET, {
        expiresIn: env.TOKEN_EXPIRATION,
      });

      await prisma.employees.update({
        data: { token_id: token },
        where: { id: clientId },
      });

      return res.status(200).json({
        message: 'Login efetuado com sucesso',
        datas: {
          id: clientId,
          firstName: employeer.first_name,
          lastName: employeer.last_name,
          token: token,
        },
      });
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new LoginController();
