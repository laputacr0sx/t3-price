import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useState } from "react";
import { demoEANID } from "../utils/helper";
import useWindowDimension from "~/hooks/useWindowDimensions";

type TailorMadeScannerProp = {
  cameraWidth: number;
};

function TailorMadeScanner({ cameraWidth }: TailorMadeScannerProp) {
  const [cameraId, setCameraId] = useState("");

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices?.length) {
          const cameraId = devices?.[0]?.id;
          if (cameraId) setCameraId(cameraId);
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
        { facingMode: "environment" },
        {
          fps: 10, // Optional, frame per seconds for qr code scanning
          qrbox: {
            width: cameraWidth * 0.8,
            height: cameraWidth * 0.2667,
          }, // Optional, if you want bounded box UI
        },
        (decodedText, decodedResult) => {
          alert(demoEANID(decodedText));
        },
        (errorMessage) => {
          throw new Error(errorMessage);
        }
      )
      .catch((err: Error) => {
        throw new Error(err.message);
      });

    return () => {
      myEANScanner.clear();
    };
  }, []);

  return (
    <>
      <h1>This is my scanner</h1>
      <div id="scanner"></div>
      <footer>This is it</footer>
    </>
  );
}

export default TailorMadeScanner;
