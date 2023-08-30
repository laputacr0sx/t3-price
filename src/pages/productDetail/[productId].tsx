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

  if (allProducts?.total && !isProductLoading) {
    return allProducts.products.map((product) => (
      <div
        key={product.id}
        className="flex gap-1 py-2"
        onClick={() => {
          console.log(`${product.id} clicked`);
        }}
      >
        <div className="h-32 w-32 min-w-fit">
          <Image
            src={"https://image.dummyjson.com/128x128"}
            alt="hello"
            loading="lazy"
            width={128}
            height={128}
          />
        </div>
        <div>
          <h1 className="pb-2 font-bold">{product.title}</h1>
          <p className="overflow-hidden font-thin">{product.description}</p>
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
