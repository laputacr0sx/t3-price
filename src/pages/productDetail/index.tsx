import { type ReactElement } from "react";
import { type NextPageWithLayout } from "../_app";

import Layout from "~/layouts/productDetailLayout";

const Index: NextPageWithLayout = () => {
  return <div>Index</div>;
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
