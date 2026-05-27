const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();
const URL = "https://www.cbit.ac.in/placement_post/notice-board/";

let cachedData = null;
let cacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchAllPlacements() {
  if (cachedData && Date.now() - cacheTime < CACHE_TTL) {
    return cachedData;
  }

  const { data } = await axios.get(URL);
  const $ = cheerio.load(data);
  const results = [];

  $(".adm-right-col ul li a").each((i, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");
    if (link && link.endsWith(".pdf")) {
      results.push({ title, link });
    }
  });

  cachedData = results;
  cacheTime = Date.now();
  return results;
}

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const allPlacements = await fetchAllPlacements();

    const total = allPlacements.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = allPlacements.slice(start, end);

    res.json({
      data: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to scrape placements" });
  }
});

module.exports = router;