import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import Layout from "~/layouts/productDetailLayout";

const Home: NextPageWithLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-blue-950  ">
      <h1 className="text-slate-100">Hello World</h1>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
