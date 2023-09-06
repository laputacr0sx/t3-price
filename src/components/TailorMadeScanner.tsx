import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useState } from "react";
import { demoEANID } from "../utils/helper";
import { Console } from "console";

type TailorMadeScannerProp = {
  cameraWidth: number;
};

function TailorMadeScanner({ cameraWidth }: TailorMadeScannerProp) {
  const [cameraId, setCameraId] = useState("");

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
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
        {
          deviceId: cameraId,
        },
        // deviceId: cameraId,
        // aspectRatio: 2.3335,
        // width: window.innerWidth * 0.8,
        // height: innerWidth * 0.2667,

        {
          fps: 10, // Optional, frame per seconds for qr code scanning
          qrbox: {
            width: 10,
            height: 10,
          }, // Optional, if you want bounded box UI
        },
        (decodedText, decodedResult) => {
          alert(demoEANID(decodedText));
        },
        (errorMessage) => {
          throw new Error(errorMessage);
        }
      )
      .catch((err) => {
        console.error(err);
      });

    // return () => {
    //   myEANScanner
    //     .stop()
    //     .then(() => {
    //       console.log("hello i am returning");
    //     })
    //     .catch((error) => console.error(error));
    // };
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
