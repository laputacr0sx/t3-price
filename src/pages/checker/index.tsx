import React, { type ReactElement } from "react";
import { useState } from "react";
import { useZxing } from "react-zxing";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const Index: NextPageWithLayout = () => {
  const [result, setResult] = useState("");
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);

  const { data: products, isLoading, error } = api.price.getAll.useQuery();
  const { data: productData } = api.price.getOne.useQuery({ ean: result });

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

  return (
    <div className="flex flex-col">
      <video
        ref={ref}
        className=" h-40 w-max items-center justify-center object-fill align-middle"
      />
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
      <div>
        <button onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </div>
      <p>{productData && JSON.stringify(productData)}</p>
      <button
        type="button"
        onClick={() => {
          setResult("");
          setPaused(false);
        }}
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
