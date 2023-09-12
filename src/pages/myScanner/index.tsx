import React, { useEffect, type ReactElement, useState } from "react";
import TailorMadeScanner from "~/components/TailorMadeScanner";

import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const MyScanner: NextPageWithLayout = () => {
  const [videoSource, setVideoSource] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaStreamTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            aspectRatio: 1.334,
          },
        });

        const streams = devices.getVideoTracks();

        // const videoInputDevices = devices.filter((device) => {
        //   console.log(JSON.stringify(device, null, 2));
        //   return device.kind === "videoinput";
        // });

        // const videoInputDevices = streams.filter((stream) => {
        //   return stream.kind === "video";
        // });

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
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId,
          aspectRatio: 1.334,
        },
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      setVideoSource(mediaStream);
      setIsLoading(false);
    } catch (error) {
      console.error("Error accessing media devices during event:", error);
      setIsLoading(false);
    }
  };

  const renderVideoSourceOptions = () => {
    if (videoDevices.length > 0) {
      return videoDevices.map(({ id, label }, index) => (
        <button
          key={id}
          onClick={() => void handleVideoSourceChange(id)}
          className="mb-1 mt-1 border-2 px-1"
        >
          Device {index + 1} : {label}
        </button>
      ));
    }
    return null;
  };

  return (
    <div className="flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-1">
        {renderVideoSourceOptions()}
      </div>
      <div className="flex-col items-center justify-center">
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
