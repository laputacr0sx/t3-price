import { type CameraDevice } from "html5-qrcode";

export type EAN = string;

export type TailorMadeScannerProp = {
  cameraWidth?: number;
  cameraHeight?: number;
  camera: CameraDevice;
};
