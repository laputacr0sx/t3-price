import { type ReactElement } from "react";
import { type NextPageWithLayout } from "~/pages/_app";

import Layout from "~/layouts/productDetailLayout";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";

const Index: NextPageWithLayout = () => {
  const router = useRouter();
  const productId = router.query.productId as string;

  const { data: allProducts, isLoading: isProductLoading } =
    api.demo.getAll.useQuery();

  const priceTag = (price: number): string => {
    return `$${price}`;
  };

  if (allProducts?.total && !isProductLoading) {
    return allProducts.products.map((product) => (
      <div
        key={product.id}
        className="flex w-max py-2"
        onClick={() => {
          console.log(`${product.id} clicked`);
        }}
      >
        <div className="flex h-12 w-12 min-w-fit items-center justify-center align-middle">
          <Image
            src="https://image.dummyjson.com/128x128"
            alt="hello"
            loading="lazy"
            width={48}
            height={48}
          />
        </div>
        <div>
          <h1 className="pb-2 font-bold">{product.title}</h1>
          <p className="text-right font-thin">{priceTag(product.price)}</p>
        </div>
      </div>
    ));
  }

  return (
    <>
      <p className="">loading product page ......</p>
    </>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
