// file = Html5QrcodePlugin.jsx
import {
  Html5QrcodeScanner,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback,
  type Html5QrcodeFullConfig,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { type Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";

import { useEffect } from "react";
import useWindowDimension from "~/hooks/useWindowDimensions";

const scannerRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
function createConfig(props: Html5QrcodeScannerConfig) {
  const config: Html5QrcodeScannerConfig = { fps: undefined };
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
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
  props: Html5QrcodeFullConfig & ScannerProp & Html5QrcodeScannerConfig
) => {
  const dimension = useWindowDimension();

  useEffect(() => {
    // when component mounts
    const config = createConfig({
      ...props,
      fps: 2,
      aspectRatio: 1.3334,
      qrbox: {
        width: dimension?.width * 0.8,
        height: dimension?.width * 0.2667,
      },
    });
    const verbose = props.verbose === true;

    console.log(config);

    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerRegionId,
      {
        ...config,
        formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
        showTorchButtonIfSupported: true,
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
