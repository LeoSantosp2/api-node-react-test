import { compareSync } from 'bcrypt';

import prisma from '../config/prisma';

export const passwordIsValid = async (
  employeer: {
    email: string;
    password: string;
  },
  password: string,
) => {
  return compareSync(password, employeer.password);
};
