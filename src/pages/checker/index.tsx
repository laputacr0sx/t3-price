import React, { type ReactElement } from "react";
import { useState } from "react";
import { useZxing } from "react-zxing";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";
import { demoEANID } from "~/utils/helper";

const Index: NextPageWithLayout = () => {
  const [result, setResult] = useState("");
  const [paused, setPaused] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);

  // const { data: products, isLoading, error } = api.price.getAll.useQuery();
  // const { data: productData } = api.price.getOne.useQuery({ ean: result });

  const { data: demoProduct, error: demoProductError } =
    api.demo.getDesired.useQuery({ id: demoEANID(result) });

  const { ref } = useZxing({
    paused,
    onDecodeResult(result) {
      setResult(result.getText());
    },
    onDecodeError(error) {
      // eslint-disable-next-line no-console
      console.log(error);
    },
    onError(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  const demoProductResult = demoProduct ? (
    <p className="text-ellipsis break-all ">
      {demoProduct && JSON.stringify(demoProduct)}
    </p>
  ) : null;

  const spinner = isProductLoading ? <>Loading</> : null;

  return (
    <div className="flex flex-col items-center">
      <video
        ref={ref}
        className="items-center justify-center self-center p-5 align-middle"
        placeholder="video here"
      />
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
      <span>{demoEANID(result)}</span>
      <div>
        <button onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      {demoProductResult}
      {spinner}
      <button
        type="reset"
        onClick={() => {
          setResult("");
          setPaused(false);
        }}
        className="h-fit w-max border-solid border-cyan-200 p-2 "
      >
        Reset
      </button>
    </div>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
