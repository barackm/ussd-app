import axios from "npm:axios@1.3.4";
import _ from "npm:lodash@4.17.21";
import type { LocationMap, LocationRawData } from "../interfaces/types.ts";

export const fetchRwandaLocationData = async (): Promise<LocationRawData> => {
  const url = "https://rwanda.p.rapidapi.com/";
  const options = {
    headers: {
      "x-rapidapi-host": "rwanda.p.rapidapi.com",
      "x-rapidapi-key": "b3b92cd968msh1b8685cbfd2d376p17f55ajsn530418dc6f03",
    },
  };

  try {
    const { data: resData } = await axios.get(url, options);
    return resData.data;
  } catch (error) {
    throw error;
  }
};

export function transformLocationData(rawData: LocationRawData[]): LocationMap {
  const transformedData: LocationMap = {};

  rawData.forEach((provinceData) => {
    for (const province in provinceData) {
      transformedData[province] = { districts: {} };
      provinceData[province].forEach((districtObj) => {
        for (const district in districtObj) {
          transformedData[province].districts[district] = { sectors: {} };
          districtObj[district].forEach((sectorObj) => {
            for (const sector in sectorObj) {
              transformedData[province].districts[district].sectors[sector] = { cells: {} };
              sectorObj[sector].forEach((cellObj) => {
                for (const cell in cellObj) {
                  transformedData[province].districts[district].sectors[sector].cells[cell] = {
                    villages: cellObj[cell],
                  };
                }
              });
            }
          });
        }
      });
    }
  });

  return transformedData;
}

const data = await fetchRwandaLocationData();
export const locationData = data as unknown as LocationRawData[];
export const locationMap = transformLocationData(data as unknown as LocationRawData[]);
