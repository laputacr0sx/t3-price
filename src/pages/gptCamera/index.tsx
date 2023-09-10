import React, { useEffect, useRef, useState } from "react";

const VideoPlayer: React.FC = () => {
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
      return videoDevices.map((device) => (
        <button
          key={device.deviceId}
          onClick={() => void handleVideoSourceChange(device.deviceId)}
        >
          {device.label}
        </button>
      ));
    }
    return null;
  };

  return (
    <div>
      <div className="video-container">
        {isLoading && <div className="loading-spinner"></div>}
        <video ref={videoRef} autoPlay playsInline controls />
      </div>
      <div>{renderVideoSourceOptions()}</div>
    </div>
  );
};

export default VideoPlayer;
