// file = Html5QrcodePlugin.jsx
import {
  Html5QrcodeScanner,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback,
  type Html5QrcodeCameraScanConfig,
  type Html5QrcodeFullConfig,
} from "html5-qrcode";

import { useEffect } from "react";
import useWindowDimension from "~/hooks/useWindowDimensions";

const scannerRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
function createConfig(props: Html5QrcodeCameraScanConfig) {
  const config: Html5QrcodeCameraScanConfig = {
    fps: 10,
    aspectRatio: 1.3334,
  };

  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
}

type ScannerProp = {
  qrCodeErrorCallback?: QrcodeErrorCallback;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
};

const Html5QrcodePlugin = (
  props: Html5QrcodeFullConfig & ScannerProp & Html5QrcodeCameraScanConfig
) => {
  const dimension = useWindowDimension();

  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;

    console.log(JSON.stringify(config));

    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerRegionId,
      {
        ...config,
        qrbox: {
          width: dimension?.width * 0.8,
          height: dimension?.width * 0.2667,
        },
      },
      verbose
    );

    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return (
    <>
      <h1>Place barcode inside the border</h1>
      <div id={scannerRegionId} className="h-[20vh] min-h-min w-screen" />
    </>
  );
};

export default Html5QrcodePlugin;
