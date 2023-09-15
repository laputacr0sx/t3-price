import { type CameraDevice } from "html5-qrcode";
import { type Dispatch, type SetStateAction } from "react";
import { type DemoProduct } from "~/server/api/routers/demoController";

export type EAN = string;

export type TailorMadeScannerProp = {
  cameraWidth?: number;
  cameraHeight?: number;
  camera: CameraDevice;
};

export type ProductModalType = {
  setIsModalShown: Dispatch<SetStateAction<boolean>>;
  isModalShown: boolean;
  currentItem: DemoProduct;
};
