import { type EAN } from "~/types/allTypes";
import { api } from "~/utils/api";
import { demoEANID } from "~/utils/helper";

const ScanResult = ({ scanResult }: { scanResult: EAN }) => {
  const { data: demoProduct } = api.demo.getDesired.useQuery({
    id: demoEANID(scanResult),
  });

  const demoProductResult = demoProduct ? (
    <p className="text-ellipsis break-all ">
      {demoProduct && JSON.stringify(demoProduct)}
    </p>
  ) : null;

  return (
    <>
      <p>{scanResult}</p>
      <p>{demoProductResult}</p>
    </>
  );
};

export default ScanResult;
