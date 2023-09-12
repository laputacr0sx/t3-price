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
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const streams = devices.filter((device) => {
          return device.kind === "videoinput";
        });
        console.log(streams);
        setVideoDevices(streams);
      } catch (error) {
        console.error("Error accessing media devices during render:", error);
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
          aspectRatio: 1,
        },
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
          className="mb-1 mt-1 break-words border-2 px-1"
        >
          Device {index + 1} : {label}
          {deviceId}
        </button>
      ));
    }
    return null;
  };

  return (
    <div className="flex-col items-center justify-center">
      <div className="flex-col items-center justify-center gap-1">
        {renderVideoSourceOptions()}
      </div>
      <div className="flex-col items-center justify-center">
        {isLoading && <div className="loading-spinner"></div>}
        {/* {videoSource ? <TailorMadeScanner stream={videoSource} /> : null} */}
      </div>
    </div>
  );
};

MyScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MyScanner;
