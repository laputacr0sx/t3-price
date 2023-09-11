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
          video: true,
        });

        const streams = devices.getVideoTracks();

        // const videoInputDevices = devices.filter((device) => {
        //   console.log(JSON.stringify(device, null, 2));
        //   return device.kind === "videoinput";
        // });

        const videoInputDevices = streams.filter((stream) => {
          console.log(JSON.stringify(stream, null, 2));
          return stream.kind === "video";
        });

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
          deviceId: deviceId,
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
      return videoDevices.map(({ id, label }) => (
        <button key={id} onClick={() => void handleVideoSourceChange(id)}>
          {label}
        </button>
      ));
    }
    return null;
  };

  return (
    <div className="flex-col items-center justify-center">
      {renderVideoSourceOptions()}
      {/* {videoDevices?.map(({ deviceId, label }, index) => (
        
        <button
          className="break-words"
          key={deviceId}
          onClick={() => void handleVideoSourceChange(deviceId)}
        >
          Device {index + 1}: {label}
        </button>
      ))} */}
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
