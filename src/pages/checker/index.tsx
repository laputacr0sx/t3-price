import { useState } from "react";
import { useZxing } from "react-zxing";
import { api } from "~/utils/api";

const Index: React.FC = () => {
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
    <>
      <video ref={ref} className="w-80" />
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
        }}
      >
        Reset
      </button>
    </>
  );
};

export default Index;
