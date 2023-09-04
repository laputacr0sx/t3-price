import { EAN } from "~/types/allTypes";

export const demoEANID = (ean: EAN): string =>
  ean
    .split("")
    .reduce((prev, curr): number => {
      return +curr * prev;
    }, 1)
    .toString()
    .slice(0, 3)
    .split("")
    .reduce((prev, curr): number => {
      return +curr + prev;
    }, 0)
    .toString();
