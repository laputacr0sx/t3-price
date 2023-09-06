import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { useEffect, useState } from "react";
import { demoEANID } from "../utils/helper";
import { api } from "~/utils/api";
import ProductModal from "./ProductModal";

type TailorMadeScannerProp = {
  cameraWidth: number;
};

function TailorMadeScanner({ cameraWidth }: TailorMadeScannerProp) {
  const [cameraList, setCameraList] = useState<CameraDevice[] | null>(null);
  const [camera, setCamera] = useState<CameraDevice | null>(null);

  const [scannedEAN, setScannedEAN] = useState<string | undefined>("");
  const [isModalShown, setIsModalShown] = useState(false);

  const { data: product } = api.demo.getDesired.useQuery({
    id: demoEANID(scannedEAN ?? ""),
  });

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices?.length) {
          setCameraList(devices);
        }
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });

    const myEANScanner = new Html5Qrcode("scanner", {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
    });

    myEANScanner
      .start(
        {
          facingMode: "environment",
          aspectRatio: 2.3335,
        },
        // deviceId: cameraId,
        // aspectRatio: 2.3335,
        // width: window.innerWidth * 0.8,
        // height: innerWidth * 0.2667,

        {
          fps: 10, // Optional, frame per seconds for qr code scanning
          qrbox: {
            width: cameraWidth * 0.8,
            height: cameraWidth * 0.525,
          }, // Optional, if you want bounded box UI
        },
        (decodedText, decodedResult) => {
          setScannedEAN(demoEANID(decodedText));

          if (isModalShown === false) {
            setIsModalShown(true);
          }
        },
        (errorMessage) => {
          throw new Error(errorMessage);
        }
      )
      .catch((err) => {
        console.error(err);
      });

    return () => {
      if (myEANScanner.isScanning) {
        myEANScanner
          .stop()
          .then(() => {
            myEANScanner.clear();
          })
          .catch((error) => console.error(error));
      }
    };
  }, []);

  return (
    <>
      <h1>This is my scanner</h1>
      <button
        onClick={() => {
          return;
        }}
        className="border-solid border-blue-200"
      >
        Toggle Camera
      </button>
      <div id="scanner"></div>

      {product ? (
        <ProductModal
          currentItem={product}
          isModalShown={isModalShown}
          setIsModalShown={setIsModalShown}
        />
      ) : null}
      <footer>This is it</footer>
    </>
  );
}

export default TailorMadeScanner;
