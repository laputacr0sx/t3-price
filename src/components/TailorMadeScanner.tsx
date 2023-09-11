import { useEffect, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { demoEANID } from "../utils/helper";

import { api } from "~/utils/api";

function TailorMadeScanner({ stream }: { stream: MediaStream }) {
  const [scannedEAN, setScannedEAN] = useState<string | null>(null);
  const [isScannerPaused, setIsScannerPaused] = useState(false);

  const { data: product } = api.demo.getDesired.useQuery(
    {
      id: demoEANID(scannedEAN ?? ""),
    },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    const windowWidth = window.innerWidth;

    const myEANScanner = new Html5Qrcode("scanner", {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
    });

    if (!isScannerPaused) {
      myEANScanner
        .start(
          {
            deviceId: stream?.id,
          },
          {
            fps: 3, // Optional, frame per seconds for qr code scanning
            qrbox: { width: windowWidth / 1.22, height: windowWidth / 3.11 },
            aspectRatio: 2.3335,
          },
          (decodedText, decodedResult) => {
            console.log(JSON.stringify(decodedResult, null, 2));
            setScannedEAN(decodedText);
            myEANScanner.stop().catch((e) => console.error(e));
            setIsScannerPaused(true);
          },
          (errorMessage) => {
            throw new Error(`from starting, ${errorMessage}`);
          }
        )
        .catch((err) => {
          console.error("Error on initiating camera", err);
        });
    }

    return () => {
      if (myEANScanner.isScanning) {
        myEANScanner.stop().catch(() => {
          return;
        });
      }
    };
  }, [isScannerPaused, stream]);

  return (
    <>
      <div className="flex justify-between">
        <h1 key={scannedEAN}>{scannedEAN ?? `This is my scanner`}</h1>
        <button
          disabled={!isScannerPaused}
          onClick={() => {
            setIsScannerPaused(false);
            setScannedEAN(null);
          }}
        >
          Toggle
        </button>
      </div>
      <div id="scanner" className="resize-none" />
      <div id="capturedImage" />
      {product ? (
        <div>
          <h3>{product.title}</h3>
          <p className="break-words text-xs font-thin">{product.description}</p>
        </div>
      ) : null}
    </>
  );
}

export default TailorMadeScanner;
