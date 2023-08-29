import { createTRPCRouter } from "~/server/api/trpc";

import { demoRouter } from "./routers/demoController";
import { priceRouter } from "./routers/productController";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  demo: demoRouter,
  price: priceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
