import { z } from 'zod';

const schema = z.object({
  TOKEN_SECRET: z.string(),
  TOKEN_EXPIRATION: z.string(),
});

export default schema.parse(process.env);
