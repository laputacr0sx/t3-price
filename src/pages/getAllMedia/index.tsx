import React, { useEffect, useState } from "react";

function GetAllMedia() {
  const [videoDevices, setVideoDevices] = useState<MediaStreamTrack[]>([]);

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.getUserMedia({
          video: {
            aspectRatio: 1.334,
          },
          audio: true,
        });

        const videoSource = devices.getTracks();

        setVideoDevices(videoSource);
      } catch (e) {
        throw new Error("something went wrong");
      }
    };
    void getVideoDevices();

    return () => {
      return;
    };
  }, []);

  return (
    <div>
      {videoDevices
        ? videoDevices.map((device) => <h1 key={device.id}>{device.label}</h1>)
        : null}
    </div>
  );
}

export default GetAllMedia;
