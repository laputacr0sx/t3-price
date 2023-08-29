import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const priceRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.product.findMany()),

  getOne: publicProcedure
    .input(z.object({ ean: z.string() }))

    .query(({ input, ctx }) =>
      ctx.prisma.product.findUniqueOrThrow({ where: { ean: input.ean } })
    ),
});
