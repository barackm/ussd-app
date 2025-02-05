import { locationData, locationMap } from "../data/localtionData.ts";
import type { LocationRawData, MenuOption } from "../interfaces/types.ts";

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
  return locationData.map((provinceObj) => Object.keys(provinceObj)[0]);
}

export function getDistricts(province: string): string[] {
  const provinceData = locationData.find((p) => Object.keys(p)[0] === province);
  if (!provinceData) return [];
  return provinceData[province].map((district) => Object.keys(district)[0]);
}

export function getSectors(district: string): string[] {
  for (const provinceObj of locationData) {
    const province = Object.values(provinceObj)[0];
    const districtData = province.find((d) => Object.keys(d)[0] === district);
    if (districtData) {
      return districtData[district].map((sector) => Object.keys(sector)[0]);
    }
  }
  return [];
}

export function getCells(sector: string): string[] {
  for (const provinceObj of locationData) {
    const province = Object.values(provinceObj)[0];
    for (const districtObj of province) {
      const district = Object.values(districtObj)[0];
      const sectorData = district.find((s) => Object.keys(s)[0] === sector);
      if (sectorData) {
        return sectorData[sector].map((cell) => Object.keys(cell)[0]);
      }
    }
  }
  return [];
}

export function getVillages(cell: string): string[] {
  for (const provinceObj of locationData) {
    const province = Object.values(provinceObj)[0];
    for (const districtObj of province) {
      const district = Object.values(districtObj)[0];
      for (const sectorObj of district) {
        const sector = Object.values(sectorObj)[0];
        const cellData = sector.find((c) => Object.keys(c)[0] === cell);
        if (cellData) {
          return cellData[cell];
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
      return locationData
        .map((provinceObj) => Object.keys(provinceObj)[0])
        .filter((province) => province.toLowerCase().includes(searchTerm))
        .map((province) => ({ province }));

    case "district":
      locationData.forEach((provinceObj) => {
        const province = Object.keys(provinceObj)[0];
        provinceObj[province].forEach((districtObj) => {
          const districtName = Object.keys(districtObj)[0];
          if (districtName.toLowerCase().includes(searchTerm)) {
            results.push({ province, district: districtName });
          }
        });
      });
      break;

    case "sector":
      locationData.forEach((provinceObj) => {
        const province = Object.keys(provinceObj)[0];
        provinceObj[province].forEach((districtObj) => {
          const districtName = Object.keys(districtObj)[0];
          districtObj[districtName].forEach((sectorObj) => {
            const sectorName = Object.keys(sectorObj)[0];
            if (sectorName.toLowerCase().includes(searchTerm)) {
              results.push({ province, district: districtName, sector: sectorName });
            }
          });
        });
      });
      break;

    case "cell":
      locationData.forEach((provinceObj) => {
        const province = Object.keys(provinceObj)[0];
        provinceObj[province].forEach((districtObj) => {
          const districtName = Object.keys(districtObj)[0];
          districtObj[districtName].forEach((sectorObj) => {
            const sectorName = Object.keys(sectorObj)[0];
            sectorObj[sectorName].forEach((cellObj) => {
              const cellName = Object.keys(cellObj)[0];
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
      });
      break;

    case "village":
      return searchVillages(query);
  }

  return results;
}

export function searchVillages(query: string): VillageLocation[] {
  const results: VillageLocation[] = [];
  const searchTerm = query.toLowerCase();

  locationData.forEach((provinceObj) => {
    const province = Object.keys(provinceObj)[0];
    provinceObj[province].forEach((districtObj) => {
      const districtName = Object.keys(districtObj)[0];
      districtObj[districtName].forEach((sectorObj) => {
        const sectorName = Object.keys(sectorObj)[0];
        sectorObj[sectorName].forEach((cellObj) => {
          const cellName = Object.keys(cellObj)[0];
          cellObj[cellName].forEach((village) => {
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
        });
      });
    });
  });

  return results;
}
