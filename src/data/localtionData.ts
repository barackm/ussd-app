import axios from "npm:axios@1.3.4";
import _ from "npm:lodash@4.17.21";
import type { LocationMap, LocationRawData } from "../interfaces/types.ts";

// export const locationMap: LocationMap = {
//   KigaliCity: {
//     districts: {
//       Nyarugenge: {
//         sectors: {
//           Gitega: {
//             cells: {
//               Akabahizi: {
//                 villages: ["Ubumwe", "Ururembo"],
//               },
//               Gacyamo: {
//                 villages: ["Ururembo", "Kinyange"],
//               },
//             },
//           },
//           Kimisagara: {
//             cells: {
//               Kamuhoza: {
//                 villages: ["Nunga"],
//               },
//               Kimisagara: {
//                 villages: ["Akabeza", "Nyakabingo"],
//               },
//             },
//           },
//           Muhima: {
//             cells: {
//               Amahoro: {
//                 villages: ["Kabirizi"],
//               },
//               Nyabugogo: {
//                 villages: ["Rwezangoro"],
//               },
//             },
//           },
//         },
//       },
//       Gasabo: {
//         sectors: {
//           Gatsata: {
//             cells: {
//               Karuruma: {
//                 villages: ["Rugoro"],
//               },
//               Nyamabuye: {
//                 villages: ["Ruvumero"],
//               },
//             },
//           },
//           Kacyiru: {
//             cells: {
//               Kamatamu: {
//                 villages: ["Rwinzovu"],
//               },
//               Kibaza: {
//                 villages: ["Inyange"],
//               },
//             },
//           },
//           Kimironko: {
//             cells: {
//               Bibare: {
//                 villages: ["Imitari"],
//               },
//               Kibagabaga: {
//                 villages: ["Karisimbi"],
//               },
//             },
//           },
//           Kinyinya: {
//             cells: {
//               Gacuriro: {
//                 villages: ["Akaruvusha"],
//               },
//               Kagugu: {
//                 villages: ["Kagarama"],
//               },
//             },
//           },
//           Remera: {
//             cells: {
//               Nyarutarama: {
//                 villages: ["Kangondo II"],
//               },
//             },
//           },
//         },
//       },
//       Kicukiro: {
//         sectors: {
//           Gahanga: {
//             cells: {
//               Kagasa: {
//                 villages: ["Nyakuguma"],
//               },
//               Murinja: {
//                 villages: ["Runyoni"],
//               },
//             },
//           },
//           Gatenga: {
//             cells: {
//               Gatenga: {
//                 villages: ["Gatenga"],
//               },
//               Nyanza: {
//                 villages: ["Gasabo"],
//               },
//             },
//           },
//           Gikondo: {
//             cells: {
//               Kagunga: {
//                 villages: ["Kabuye I"],
//               },
//               Kinunga: {
//                 villages: ["Ruganwa II"],
//               },
//             },
//           },
//           Kanombe: {
//             cells: {
//               Kabeza: {
//                 villages: ["Giporoso II"],
//               },
//               Karama: {
//                 villages: ["Nyabyunyu"],
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// };

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
    const data = resData.data;
    const kigaliData: LocationRawData = data?.find(
      (province: LocationRawData) => Object.keys(province)[0] === "Kigali",
    );
    return kigaliData;
  } catch (error) {
    console.error("Failed to fetch Rwanda location data:", error);
    throw error;
  }
};

export function transformLocationData(rawData: LocationRawData): LocationMap {
  const transformedData: LocationMap = {};

  for (const province in rawData) {
    transformedData[province] = { districts: {} };
    rawData[province].forEach((districtObj) => {
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

  return transformedData;
}

const data = await fetchRwandaLocationData();
export const locationMap = transformLocationData(data as unknown as LocationRawData);
