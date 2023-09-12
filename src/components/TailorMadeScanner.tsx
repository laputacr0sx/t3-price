import { useEffect, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { demoEANID } from "../utils/helper";

import { api } from "~/utils/api";

function TailorMadeScanner({ stream }: { stream: MediaStream }) {
  const videoTarget = stream.getVideoTracks()[0]!;

  const { id: streamId } = videoTarget;
  const [scannedEAN, setScannedEAN] = useState<string | null>(null);
  const [isScannerPaused, setIsScannerPaused] = useState(false);

  const { data: product, error: productError } = api.demo.getDesired.useQuery(
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
            deviceId: streamId,
          },
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
            qrbox: { width: windowWidth * 0.9, height: windowWidth * 0.39 },
            aspectRatio: 1,
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
  }, [isScannerPaused, streamId]);

  if (productError)
    <>
      <h1>Error occured during fetching</h1>
    </>;

  return (
    <>
      <div className="flex justify-between bg-slate-900 px-4 py-1">
        <h2 className="self-center align-middle">
          {isScannerPaused ? "Scan paused" : "Awaiting valid barcodes"}
        </h2>
        <button
          disabled={!isScannerPaused}
          onClick={() => {
            setIsScannerPaused(false);
            setScannedEAN(null);
          }}
          className="rounded-md border-2 border-solid border-slate-200 px-2 py-1 text-slate-200 disabled:border-green-800 disabled:text-green-800 "
        >
          {isScannerPaused ? "Scan Again" : "Scanning"}
        </button>
      </div>
      <h1 key={scannedEAN}>{scannedEAN ?? `This is my scanner ${streamId}`}</h1>
      <div id="scanner" className="w-screen resize-none" />
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
