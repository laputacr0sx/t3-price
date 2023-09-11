import React, { useEffect, type ReactElement, useState } from "react";
import TailorMadeScanner from "~/components/TailorMadeScanner";

import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const MyScanner: NextPageWithLayout = () => {
  const [videoSource, setVideoSource] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="flex-col items-center justify-center">
      {videoDevices?.map(({ deviceId, label }, index) => (
        <button
          className="break-words"
          key={deviceId}
          onClick={() => void handleVideoSourceChange(deviceId)}
        >
          Device {index + 1}: {label}
        </button>
      ))}
      <div>
        {isLoading && <div className="loading-spinner"></div>}
        {videoSource ? <TailorMadeScanner stream={videoSource} /> : null}
      </div>
    </div>
  );
};

MyScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MyScanner;
