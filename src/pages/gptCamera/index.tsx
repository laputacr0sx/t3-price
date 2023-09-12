import { type ReactElement, useEffect, useRef, useState } from "react";

import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const VideoPlayer: NextPageWithLayout = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (videoRef.current && videoSource) {
      videoRef.current.srcObject = videoSource;
    }
  }, [videoSource]);

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setVideoDevices(videoInputDevices);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    void getVideoDevices();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const html5QrCode = new Html5Qrcode("video", {
        verbose: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
      });

      const scanQRCode = async () => {
        if (videoSource) {
          console.log(videoSource, videoSource.id);
          try {
            await html5QrCode.start(
              { deviceId: videoSource.id },
              // videoElement,
              { fps: 4, qrbox: { width: 200, height: 100 } },
              (text, result) => {
                setIsScanning(true);
                console.log(text);
                console.log(JSON.stringify(result, null, 2));
                const onSuccessTerminate = async () => {
                  try {
                    setIsScanning(false);
                    await html5QrCode.stop();
                  } catch (error) {
                    throw new Error("Error in terminating after onScanSuccess");
                  }
                };
                void onSuccessTerminate();
              },
              (errorMessage, error) => {
                console.error(errorMessage, error);
              }
            );
          } catch (error) {
            console.error("QR Code Scanner Initiating error:", error);
          }
        }
      };

      void scanQRCode();

      return () => {
        if (isScanning) {
          html5QrCode
            .stop()
            .catch((e) => console.error("Error in terminating Scanner", e));
        }
      };
    }
  }, [isScanning, videoSource]);

  const handleVideoSourceChange = async (deviceId: string) => {
    try {
      setIsLoading(true);
      const constraints = {
        video: {
          deviceId: { ideal: deviceId },
          aspectRatio: 1.7778,
        },
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      setVideoSource(stream);
      setIsLoading(false);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setIsLoading(false);
    }
  };

  const renderVideoSourceOptions = () => {
    if (videoDevices.length > 0) {
      return videoDevices.map(({ deviceId, label }, index) => (
        <button
          key={deviceId}
          onClick={() => void handleVideoSourceChange(deviceId)}
          className="mb-1 mt-1 border-2 px-1"
        >
          Device {index + 1} : {label}
        </button>
      ));
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        {isLoading && <div className="loading-spinner"></div>}
        <video id={"video"} ref={videoRef} playsInline autoPlay autoFocus />
        <div id="qr-code-reader"></div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {renderVideoSourceOptions()}
      </div>
    </div>
  );
};

VideoPlayer.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default VideoPlayer;
