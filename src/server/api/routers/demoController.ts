import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const demoRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return;
  }),
});
