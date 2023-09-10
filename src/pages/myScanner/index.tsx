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
  const [cameraList, setCameraList] = useState<CameraDevice[]>([]);

  const randomDeviceSelect = useCallback(() => {
    return Math.floor(cameraList.length * Math.random());
  }, [cameraList]);

  const selectedCamera = cameraList[randomDeviceSelect()];

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       audio: false,
  //       video: { width: 320, height: 320 },
  //     })
  //     .then((mediaStream) => {
  //       const allMediaStream = mediaStream.getVideoTracks();
  //       do {
  //         setIsCameraLoading(false);
  //         allMediaStream.forEach((media) => {
  //           console.log("Media Tracks obtained");
  //           const { id, label } = media;
  //           setCameraList([{ id, label }, ...cameraList]);
  //         });
  //       } while (cameraList.length < 1 && isCameraLoading === false);
  //       const randomDeviceSelect = Math.floor(
  //         cameraList.length * Math.random()
  //       );
  //       console.log(cameraList);
  //       setCamera(cameraList[randomDeviceSelect]);
  //       // console.error("sorry you have no media devices");
  //     })
  //     .catch((e) => console.error("from navigator", e));
  // }, []);

  useEffect(() => {
    const obtainUserMedia = async () => {
      try {
        const streamTracks = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { width: 320, height: 320 },
        });
        streamTracks.getTracks().forEach((stream) => {
          const { id, label } = stream;
          setCameraList([...cameraList, { id, label }]);
        });
      } catch (error) {
        console.log(error);
      }
    };

    void obtainUserMedia();

    // videoTracks.forEach((stream) => {
    //   const { id, label } = stream;
    //   setCameraList([...cameraList, { id, label }]);
    // });
  }, []);

  return (
    <div className="flex-col items-center justify-center">
      {cameraList?.map((camera, index) => (
        <div className="break-words" key={camera.id}>
          <h2>
            Device {index + 1}: {camera.label}
          </h2>
          <p className="text-xs font-thin ">{camera.id}</p>
        </div>
      ))}
      {selectedCamera ? <TailorMadeScanner camera={selectedCamera} /> : null}
    </div>
  );
};

MyScanner.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MyScanner;
