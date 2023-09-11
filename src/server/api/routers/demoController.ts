import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type DemoProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

type DemoAllProductResponse = {
  products: DemoProduct[];
  total: number;
  skip: number;
  limit: number;
};

export const demoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const demoAllProductResponse = await axios.get<DemoAllProductResponse>(
      "https://dummyjson.com/products"
    );

    return demoAllProductResponse.data;
  }),

  getDesired: publicProcedure
    .input(
      z.object({
        id: z.string({ invalid_type_error: "invalid input" }).max(30),
      })
    )
    .query(async ({ input, ctx }) => {
      // await ctx.prisma.product.findUniqueOrThrow({ where: { ean: input.id } });
      const demoProductResponse = await axios.get<DemoProduct>(
        `http://dummyjson.com/product/${input.id}`
      );
      return demoProductResponse.data;
    }),
});
