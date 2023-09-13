import React, {
  type ReactElement,
  useEffect,
  useState,
  startTransition,
} from "react";
import {
  type CameraDevice,
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const BarcodeScanner: NextPageWithLayout = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [cameraInUse, setCameraInUse] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const obtainCameras = async () => {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length > 0) {
        cameras.forEach((camera) => {
          setCameras([...cameras, camera]);
        });
      }
    };
    void obtainCameras();
  }, []);

  useEffect(() => {
    const elementId = "scanner-region";
    const windowWidth = window.innerWidth;

    const eanScanner = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
    });

    if (cameraInUse) {
      try {
        void eanScanner.start(
          { deviceId: cameraInUse?.id },
          {
            fps: 4,
            aspectRatio: 1,
            qrbox: { width: windowWidth * 0.9, height: windowWidth * 0.39 },
          },
          (text, result) => {
            console.log(text);
          },
          (message, error) => {
            if (error instanceof Error) {
              throw error;
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    return () => {
      //
    };
  }, [cameraInUse]);

  const handleVideoSourceChange = async (deviceId: string) => {
    try {
      setIsLoading(true);
      const constraints = {
        video: {
          deviceId: { ideal: deviceId },
          aspectRatio: 1,
        },
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      setCameraInUse(stream);
      setIsLoading(false);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="flex-col items-center justify-center gap-1">
        {cameras.length > 0
          ? cameras.map(({ id, label }, index) => (
              <button
                key={id + index}
                onClick={() => void handleVideoSourceChange(id)}
                className="mb-1 mt-1 break-all border-2 px-1"
              >
                Device {index + 1} : {label}
              </button>
            ))
          : null}
      </div>
      <div id="scanner-region" className="w-screen resize-none" />
    </div>
  );
};

BarcodeScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BarcodeScanner;
