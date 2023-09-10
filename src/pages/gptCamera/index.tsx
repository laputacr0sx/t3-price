import React, { ReactElement, useEffect, useRef, useState } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";

const VideoPlayer: NextPageWithLayout = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleVideoSourceChange = async (deviceId: string) => {
    try {
      setIsLoading(true);

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: { ideal: deviceId },
          facingMode: "environment",
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
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="">
        {isLoading && <div className="loading-spinner"></div>}
        {videoRef ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            controls
            key={videoSource?.id}
          />
        ) : null}
      </div>
      <div>{renderVideoSourceOptions()}</div>
    </div>
  );
};

export default VideoPlayer;

VideoPlayer.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
