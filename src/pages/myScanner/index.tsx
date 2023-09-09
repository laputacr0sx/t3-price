import React, { useEffect, type ReactElement, useState } from "react";
import TailorMadeScanner from "~/components/TailorMadeScanner";

import { type NextPageWithLayout } from "../_app";
import Layout from "~/layouts/productDetailLayout";
import { type CameraDevice } from "html5-qrcode";

const MyScanner: NextPageWithLayout = () => {
  const [cameraList, setCameraList] = useState<CameraDevice[]>([]);
  const [camera, setCamera] = useState<CameraDevice>();
  const [isCameraLoading, setIsCameraLoading] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { width: 320, height: 320 },
      })
      .then((mediaStream) => {
        const allMediaStream = mediaStream.getVideoTracks();
        do {
          setIsCameraLoading(false);
          allMediaStream.forEach((media) => {
            console.log("Media Tracks obtained");
            const { id, label } = media;
            setCameraList([{ id, label }, ...cameraList]);
          });
        } while (cameraList.length > 1 && !isCameraLoading);
        const randomDeviceSelect = Math.floor(
          cameraList.length * Math.random()
        );
        setCamera(cameraList[randomDeviceSelect]);
        console.log(camera);
        // console.error("sorry you have no media devices");
      })
      .catch((e) => console.error("from navigator", e))
      .finally(() => {
        console.log("all procedure loaded");
      });
  }, []);

  return (
    <div className="flex-col items-center justify-center">
      {camera ? (
        <TailorMadeScanner camera={camera} cameraList={cameraList} />
      ) : null}
    </div>
  );
};

MyScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MyScanner;
