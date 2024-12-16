import { locationMap } from "../data/localtionData.ts";
import type { LocationRawData, MenuOption } from "../interfaces/types.ts";
import locationData from "../data/kigaliData.json" with { type: "json" };
const data = locationData as unknown as LocationRawData;
type SearchTarget = "province" | "district" | "sector" | "cell" | "village";

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

export function getProvinces(): string[] {
  return Object.keys(data);
}

export function getDistricts(province: string): string[] {
  const provinceData = data[province];
  if (!provinceData?.length) return [];
  return provinceData.map((district) => Object.keys(district)[0]);
}

export function getSectors(district: string): string[] {
  for (const province of Object.values(data)) {
    const districtData = province.find((d) => Object.keys(d)[0] === district);
    if (districtData) {
      return districtData[district].map((sector) => Object.keys(sector)[0]);
    }
  }
  return [];
}

export function getCells(sector: string): string[] {
  for (const province of Object.values(data)) {
    for (const district of province) {
      const sectors = district[Object.keys(district)[0]];
      const sectorData = sectors.find((s) => Object.keys(s)[0] === sector);
      if (sectorData) {
        return Object.keys(sectorData[sector][0]);
      }
    }
  }
  return [];
}

export function getVillages(cell: string): string[] {
  for (const province of Object.values(data)) {
    for (const district of province) {
      for (const sector of district[Object.keys(district)[0]]) {
        const cells = sector[Object.keys(sector)[0]];
        for (const cellData of cells) {
          if (cell in cellData) {
            return cellData[cell];
          }
        }
      }
    }
  }
  return [];
}

interface VillageLocation {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

export function searchByTarget(query: string, target: SearchTarget): Array<Partial<VillageLocation>> {
  const results: Array<Partial<VillageLocation>> = [];
  const searchTerm = query.toLowerCase();

  switch (target) {
    case "province":
      return Object.keys(data)
        .filter((province) => province.toLowerCase().includes(searchTerm))
        .map((province) => ({ province }));

    case "district":
      for (const [province, districts] of Object.entries(data)) {
        districts.forEach((district) => {
          const districtName = Object.keys(district)[0];
          if (districtName.toLowerCase().includes(searchTerm)) {
            results.push({ province, district: districtName });
          }
        });
      }
      break;

    case "sector":
      for (const [province, districts] of Object.entries(data)) {
        districts.forEach((district) => {
          const districtName = Object.keys(district)[0];
          district[districtName].forEach((sector) => {
            const sectorName = Object.keys(sector)[0];
            if (sectorName.toLowerCase().includes(searchTerm)) {
              results.push({ province, district: districtName, sector: sectorName });
            }
          });
        });
      }
      break;

    case "cell":
      for (const [province, districts] of Object.entries(data)) {
        districts.forEach((district) => {
          const districtName = Object.keys(district)[0];
          district[districtName].forEach((sector) => {
            const sectorName = Object.keys(sector)[0];
            sector[sectorName].forEach((cell) => {
              const cellName = Object.keys(cell)[0];
              if (cellName.toLowerCase().includes(searchTerm)) {
                results.push({
                  province,
                  district: districtName,
                  sector: sectorName,
                  cell: cellName,
                });
              }
            });
          });
        });
      }
      break;

    case "village":
      return searchVillages(query);
  }

  return results;
}

export function searchVillages(query: string): VillageLocation[] {
  const results: VillageLocation[] = [];
  const searchTerm = query.toLowerCase();

  for (const [province, districts] of Object.entries(data)) {
    for (const district of districts) {
      const districtName = Object.keys(district)[0];
      const sectors = district[districtName];

      for (const sector of sectors) {
        const sectorName = Object.keys(sector)[0];
        const cells = sector[sectorName];

        for (const cell of cells) {
          const cellName = Object.keys(cell)[0];
          const villages = cell[cellName];

          villages.forEach((village) => {
            if (village.toLowerCase().includes(searchTerm)) {
              results.push({
                province,
                district: districtName,
                sector: sectorName,
                cell: cellName,
                village,
              });
            }
          });
        }
      }
    }
  }

  return results;
}
