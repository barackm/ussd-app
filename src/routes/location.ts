import express from "npm:express@4.18.2";
import { Router } from "npm:express@4.18.2";
import {
  getCells,
  getDistricts,
  getProvinces,
  getSectors,
  getVillages,
  searchByTarget,
} from "../utils/locationUtils.ts";

const router = Router();

interface LocationQuery {
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
}
const MAX_RESULTS = 5;

type SearchTarget = "province" | "district" | "sector" | "cell" | "village";

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

router.get("/", (req: express.Request, res: express.Response) => {
  const { province, district, sector, cell } = req.query as LocationQuery;

  try {
    if (cell) return res.json(getVillages(cell));
    if (sector) return res.json(getCells(sector));
    if (district) return res.json(getSectors(district));
    if (province) return res.json(getDistricts(province));
    return res.json(getProvinces());
  } catch (error) {
    return res.status(400).json([]);
  }
});

router.get("/search", (req: express.Request, res: express.Response) => {
  const query = req.query.q as string;
  const target = (req.query.target || "village") as SearchTarget;

  if (!query || query.length < 2) {
    return res.status(400).json({
      error: "Search query must be at least 2 characters long",
    });
  }

  const validTargets: SearchTarget[] = ["province", "district", "sector", "cell", "village"];
  if (!validTargets.includes(target)) {
    return res.status(400).json({
      error: "Invalid target parameter",
    });
  }

  try {
    const allResults = searchByTarget(query, target);
    const limitedResults = allResults.slice(0, MAX_RESULTS);

    return res.json({
      results: limitedResults,
      total: allResults.length,
      limit: MAX_RESULTS,
      target,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to search locations",
    });
  }
});

export default router;
