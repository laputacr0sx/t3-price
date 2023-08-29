import { type ReactElement } from "react";
import { type NextPageWithLayout } from "~/pages/_app";

import Layout from "~/layouts/productDetailLayout";
import { useRouter } from "next/router";

const Index: NextPageWithLayout = () => {
  const router = useRouter();
  const productId = router.query.productId as string;

  console.log(productId);

  return (
    <>
      <p className="">This is showing Product Details about {productId}</p>
    </>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
