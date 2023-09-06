import { type EAN } from "~/types/allTypes";

export const demoEANID = (ean: EAN): string => {
  return ean
    .split("")
    .reduce((prev, curr): number => {
      return parseInt(curr === "0" ? "1" : curr) * prev;
    }, 1)
    .toString()
    .slice(0, 3)
    .split("")
    .reduce((prev, curr): number => {
      return parseInt(curr) + prev;
    }, 0)
    .toString();
};

console.log(demoEANID(""));

export const getRandomImage = (images: string[]): string => {
  const imagesLength = images?.length;
  const randomImagePosition = Math.floor(Math.random() * imagesLength);

  return images.at(randomImagePosition)!;
};
