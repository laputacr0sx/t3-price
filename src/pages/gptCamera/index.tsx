import { type ReactElement, useEffect, useRef, useState } from "react";

import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback,
} from "html5-qrcode";
import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const VideoPlayer: NextPageWithLayout = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const onScanSuccessHandler: QrcodeSuccessCallback = (text, result) => {
    console.log(text);
    console.log(JSON.stringify(result, null, 2));
  };
  const onScanErrorHandler: QrcodeErrorCallback = (errorMessage, error) => {
    console.error(errorMessage, error);
  };

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
      const html5QrCode = new Html5Qrcode("qr-code-reader");

      const scanQRCode = async (videoElement: HTMLVideoElement) => {
        try {
          await html5QrCode.start(
            videoElement,
            { fps: 10, qrbox: 250 },
            onScanSuccessHandler,
            onScanErrorHandler
          );
        } catch (error) {
          console.error("QR code scanning error:", error);
        }
      };

      void scanQRCode(videoRef.current);

      return () => {
        html5QrCode.stop().catch((e) => console.error(e));
      };
    }
  }, []);

  const handleVideoSourceChange = async (deviceId: string) => {
    try {
      setIsLoading(true);
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          aspectRatio: 2.5558,
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
      return videoDevices.map(({ deviceId, label }) => (
        <button
          key={deviceId}
          onClick={() => void handleVideoSourceChange(deviceId)}
        >
          {label}
        </button>
      ));
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        {isLoading && <div className="loading-spinner"></div>}
        <video ref={videoRef} />
        <div id="qr-code-reader"></div>
      </div>
      <div>{renderVideoSourceOptions()}</div>
    </div>
  );
};

VideoPlayer.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default VideoPlayer;
