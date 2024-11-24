// deno-lint-ignore-file no-explicit-any
import { locationMap } from "../data/localtionData.ts";
import type { MenuOption } from "../interfaces/types.ts";

export const getProvincesOptions = (): {
  menuOptions: MenuOption;
  reverseMap: { [key: string]: string };
} => {
  const menuOptions: MenuOption = {};
  const reverseMap: { [key: string]: string } = {};

  Object.keys(locationMap).forEach((province, index) => {
    const optionNumber = (index + 1).toString();
    menuOptions[optionNumber] = province;
    reverseMap[optionNumber] = province;
  });

  return { menuOptions: menuOptions, reverseMap };
};

export const getDistrictsOptions = (
  provinceKey: string,
): {
  menuOptions: MenuOption;
  reverseMap: { [key: string]: string };
} => {
  const options: MenuOption = {};
  const reverseMap: { [key: string]: string } = {};
  const province = locationMap[provinceKey];

  if (!province) {
    return { menuOptions: options, reverseMap };
  }

  Object.keys(province.districts).forEach((district, index) => {
    const optionNumber = (index + 1).toString();
    options[optionNumber] = district;
    reverseMap[optionNumber] = district;
  });

  return { menuOptions: options, reverseMap };
};

export const getSectorsOptions = (
  provinceKey: string,
  districtKey: string,
): {
  menuOptions: MenuOption;
  reverseMap: { [key: string]: string };
} => {
  const options: MenuOption = {};
  const reverseMap: { [key: string]: string } = {};
  const district = locationMap[provinceKey]?.districts[districtKey];

  if (!district) return { menuOptions: options, reverseMap };

  Object.keys(district.sectors).forEach((sector, index) => {
    const optionNumber = (index + 1).toString();
    options[optionNumber] = sector;
    reverseMap[optionNumber] = sector;
  });

  return { menuOptions: options, reverseMap };
};
export const getCellsOptions = (
  provinceKey: string,
  districtKey: string,
  sectorKey: string,
): {
  menuOptions: MenuOption;
  reverseMap: { [key: string]: string };
} => {
  const options: MenuOption = {};
  const reverseMap: { [key: string]: string } = {};
  const sector = locationMap[provinceKey]?.districts[districtKey]?.sectors[sectorKey];

  if (!sector) return { menuOptions: options, reverseMap };

  Object.keys(sector.cells).forEach((cell, index) => {
    const optionNumber = (index + 1).toString();
    options[optionNumber] = cell;
    reverseMap[optionNumber] = cell;
  });

  return { menuOptions: options, reverseMap };
};

export const getVillagesOptions = (
  provinceKey: string,
  districtKey: string,
  sectorKey: string,
  cellKey: string,
): {
  menuOptions: MenuOption;
  reverseMap: { [key: string]: string };
} => {
  const options: MenuOption = {};
  const reverseMap: { [key: string]: string } = {};
  const cell = locationMap[provinceKey]?.districts[districtKey]?.sectors[sectorKey]?.cells[cellKey];

  if (!cell) return { menuOptions: options, reverseMap };

  cell.villages.forEach((village, index) => {
    const optionNumber = (index + 1).toString();
    options[optionNumber] = village;
    reverseMap[optionNumber] = village;
  });

  return { menuOptions: options, reverseMap };
};
