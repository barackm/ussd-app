import express from "npm:express@4.18.2";
import { Router } from "npm:express@4.18.2";
import { LocationRawData } from "../interfaces/types.ts";
import locationData from "../data/kigaliData.json" with { type: "json" };

const router = Router();
const data = locationData as unknown as LocationRawData;

interface LocationQuery {
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
}

function getProvinces(): string[] {
  return Object.keys(data);
}

function getDistricts(province: string): string[] {
  const provinceData = data[province];
  if (!provinceData?.length) return [];
  return provinceData.map(district => Object.keys(district)[0]);
}

function getSectors(district: string): string[] {
  for (const province of Object.values(data)) {
    const districtData = province.find(d => Object.keys(d)[0] === district);
    if (districtData) {
      const sectors = districtData[district];
      return sectors.map(sector => Object.keys(sector)[0]);
    }
  }
  return [];
}

function getCells(sector: string): string[] {
  for (const province of Object.values(data)) {
    for (const district of province) {
      const districtName = Object.keys(district)[0];
      const sectors = district[districtName];
      const sectorData = sectors.find(s => Object.keys(s)[0] === sector);
      if (sectorData) {
        return Object.keys(sectorData[sector][0]);
      }
    }
  }
  return [];
}

function getVillages(cell: string): string[] {
  for (const province of Object.values(data)) {
    for (const district of province) {
      const districtName = Object.keys(district)[0];
      const sectors = district[districtName];
      for (const sector of sectors) {
        const sectorName = Object.keys(sector)[0];
        const cells = sector[sectorName];
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

router.get("/", (req: express.Request, res: express.Response) => {
  const { province, district, sector, cell } = req.query as LocationQuery;

  try {
    if (cell) {
      return res.json(getVillages(cell));
    }
    if (sector) {
      return res.json(getCells(sector));
    }
    if (district) {
      return res.json(getSectors(district));
    }
    if (province) {
      return res.json(getDistricts(province));
    }
    return res.json(getProvinces());
  } catch (error) {
    return res.status(400).json([]);
  }
});

export default router;