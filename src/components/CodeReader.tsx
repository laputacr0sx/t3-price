// file = Html5QrcodePlugin.jsx
import {
  Html5QrcodeScanner,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback,
  type Html5QrcodeCameraScanConfig,
  type Html5QrcodeFullConfig,
} from "html5-qrcode";

import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
function createConfig(props: Html5QrcodeCameraScanConfig) {
  const config: Html5QrcodeCameraScanConfig = {
    fps: 10,
  };
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
  props: Html5QrcodeFullConfig & ScannerProp & Html5QrcodeCameraScanConfig
) => {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;

    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
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
  });

  return (
    <>
      <div id={qrcodeRegionId} />
    </>
  );
};

export default Html5QrcodePlugin;
