import React, {
  useEffect,
  type ReactElement,
  useState,
  useCallback,
} from "react";
import TailorMadeScanner from "~/components/TailorMadeScanner";

import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";
import { type CameraDevice } from "html5-qrcode";

const MyScanner: NextPageWithLayout = () => {
  const [videoSource, setVideoSource] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameraList, setCameraList] = useState<CameraDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const randomDeviceSelect = useCallback(() => {
    return Math.floor(cameraList.length * Math.random());
  }, [cameraList]);

  const selectedCamera = cameraList[randomDeviceSelect()];

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
    const obtainUserMedia = async () => {
      try {
        const streamTracks = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 320 },
        });
        streamTracks.getTracks().forEach((stream) => {
          const { id, label } = stream;
          setCameraList([...cameraList, { id, label }]);
        });
      } catch (error) {
        throw new Error("Error obtaining camera from parent");
      }
    };

    void obtainUserMedia();
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
        {selectedCamera ? <TailorMadeScanner camera={selectedCamera} /> : null}
      </div>
    </div>
  );
};

MyScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MyScanner;
