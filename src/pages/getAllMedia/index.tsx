import React, { useEffect, useState } from "react";

function GetAllMedia() {
  const [videoSource, setVideoSource] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        setVideoDevices(devices);
      } catch (e) {
        throw new Error("something went wrong");
      }
    };
    void getVideoDevices();

    return () => {
      return;
    };
  }, []);

  const handleVideoSourceChange = async (deviceId: string) => {
    try {
      setIsLoading(true);
      const constraints = {
        video: {
          deviceId: { ideal: deviceId },
          aspectRatio: 1.7778,
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
          className="mb-1 mt-1 border-2 px-1"
        >
          Device {index + 1} : {label}
        </button>
      ));
    }
    return null;
  };

  return (
    <div>
      {isLoading && <div className="loading-spinner"></div>}

      {videoDevices
        ? videoDevices.map((device) => (
            <h1 key={device.deviceId}>{device.label}</h1>
          ))
        : null}
      <div className="flex flex-col items-center justify-center">
        {renderVideoSourceOptions()}
      </div>
      <div>{JSON.stringify(videoSource)}</div>
    </div>
  );
}

export default GetAllMedia;
