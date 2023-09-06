import React, { type ReactElement } from "react";
import TailorMadeScanner from "~/components/TailorMadeScanner";
import useWindowDimension from "~/hooks/useWindowDimensions";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const MyScanner: NextPageWithLayout = () => {
  const { width } = useWindowDimension();

  return (
    <div className="flex-col items-center justify-center">
      <TailorMadeScanner cameraWidth={width} />
    </div>
  );
};

MyScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MyScanner;
