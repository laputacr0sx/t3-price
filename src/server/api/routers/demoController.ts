import axios from "axios";

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

type ProductResponse = {
  products: DemoProduct[];
  total: number;
  skip: number;
  limit: number;
};

export const demoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const productResponse = await axios.get<ProductResponse>(
      "https://dummyjson.com/products"
    );

    return productResponse.data;
  }),
});
