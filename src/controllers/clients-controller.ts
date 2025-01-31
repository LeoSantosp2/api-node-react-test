import { Response } from 'express';
import { v4 } from 'uuid';

import prisma from '../config/prisma';

import { RequestProps } from '../interfaces/request-props';
import { ClientsBodyProps } from '../interfaces/clients-body-props';

class ClientsController {
  async index(req: RequestProps, res: Response) {
    try {
      const { q } = req.query;

      if (q) {
        const clients = await prisma.clients.findMany({
          where: { OR: [{ name: { contains: q } }, { cpf: { contains: q } }] },
          orderBy: { name: 'asc' },
        });

        return res.status(200).json(clients);
      }

      const clients = await prisma.clients.findMany({
        orderBy: { name: 'asc' },
      });

      return res.status(200).json(clients);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async show(req: RequestProps, res: Response) {
    try {
      const { id } = req.params;

      const client = await prisma.clients.findFirst({ where: { id } });

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      return res.status(200).json(client);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async store(req: RequestProps<ClientsBodyProps>, res: Response) {
    try {
      const {
        name,
        cpf,
        date_of_birth,
        street_address,
        neighborhood_address,
        city_address,
        state_address,
        complement_address,
        number_address,
        zipcode_address,
      } = req.body;

      if (
        !name ||
        !cpf ||
        !date_of_birth ||
        !street_address ||
        !neighborhood_address ||
        !city_address ||
        !state_address ||
        !complement_address ||
        !number_address ||
        !zipcode_address
      ) {
        return res
          .status(400)
          .json({ error: 'Os campos não podem estar vazios.' });
      }

      const clientExists = await prisma.clients.findFirst({
        select: { name: true },
        where: { cpf },
      });

      if (clientExists) {
        return res.status(400).json({ error: 'Cliente já cadastrado.' });
      }

      const newClient = {
        id: v4(),
        name,
        cpf,
        date_of_birth,
        street_address,
        number_address,
        complement_address,
        neighborhood_address,
        city_address,
        state_address,
        zipcode_address,
      };

      await prisma.clients.create({ data: newClient });

      return res.status(201).json('Cliente cadastrado com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: RequestProps<ClientsBodyProps>, res: Response) {
    try {
      const { id } = req.params;
      const {
        name,
        date_of_birth,
        street_address,
        neighborhood_address,
        city_address,
        state_address,
        complement_address,
        number_address,
        zipcode_address,
      } = req.body;

      const user = await prisma.clients.findFirst({
        select: {
          name: true,
          date_of_birth: true,
          street_address: true,
          neighborhood_address: true,
          city_address: true,
          state_address: true,
          complement_address: true,
          number_address: true,
          zipcode_address: true,
        },
        where: { id },
      });

      if (!user) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      if (user.name !== name) {
        await prisma.clients.update({ data: { name }, where: { id } });
      }

      if (user.date_of_birth !== date_of_birth) {
        await prisma.clients.update({
          data: { date_of_birth },
          where: { id },
        });
      }

      if (user.street_address !== street_address) {
        await prisma.clients.update({
          data: { street_address },
          where: { id },
        });
      }

      if (user.neighborhood_address !== neighborhood_address) {
        await prisma.clients.update({
          data: { neighborhood_address },
          where: { id },
        });
      }

      if (user.city_address !== city_address) {
        await prisma.clients.update({ data: { city_address }, where: { id } });
      }

      if (user.state_address !== state_address) {
        await prisma.clients.update({ data: { state_address }, where: { id } });
      }

      if (user.complement_address !== complement_address) {
        await prisma.clients.update({
          data: { complement_address },
          where: { id },
        });
      }

      if (user.number_address !== number_address) {
        await prisma.clients.update({
          data: { number_address },
          where: { id },
        });
      }

      if (user.zipcode_address !== zipcode_address) {
        await prisma.clients.update({
          data: { zipcode_address },
          where: { id },
        });
      }

      return res.status(200).json('Dados atualizados com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async delete(req: RequestProps, res: Response) {
    try {
      const { id } = req.params;

      const client = await prisma.clients.findFirst({
        select: { name: true },
        where: { id },
      });

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      await prisma.clients.delete({ where: { id } });

      return res.status(200).json('Cliente excluido com sucesso.');
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
}

export default new ClientsController();
