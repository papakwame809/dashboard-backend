require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const ZAFRONIX_API_KEY = process.env.ZAFRONIX_API_KEY;

const FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4";

console.log("Football Data Key Loaded:", !!FOOTBALL_DATA_API_KEY);
console.log("Zafronix Key Loaded:", !!ZAFRONIX_API_KEY);

/* --------------------------------------------------
   GROUPS (Football Data API)
-------------------------------------------------- */
app.get("/api/worldcup/groups", async (req, res) => {
  try {
    const url = `${FOOTBALL_DATA_BASE_URL}/competitions/WC/standings`;

    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": FOOTBALL_DATA_API_KEY
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data
      });
    }

    res.json(data);
  } catch (error) {
    console.error("GROUPS ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* --------------------------------------------------
   FIXTURES (Football Data API)
-------------------------------------------------- */
app.get("/api/worldcup/fixtures", async (req, res) => {
  try {
    const url = `${FOOTBALL_DATA_BASE_URL}/competitions/WC/matches`;

    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": FOOTBALL_DATA_API_KEY
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data
      });
    }

    res.json(data);
  } catch (error) {
    console.error("FIXTURES ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* --------------------------------------------------
   TEAM ROSTER (Zafronix API)
-------------------------------------------------- */
app.get("/api/worldcup/teams/:teamName", async (req, res) => {
  const { teamName } = req.params;

  try {
    const url =
      `https://api.zafronix.com/fifa/worldcup/v1/teams/${encodeURIComponent(
        teamName
      )}/roster?year=1986`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": ZAFRONIX_API_KEY
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data
      });
    }

    res.json(data);
  } catch (error) {
    console.error("ROSTER ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`World Cup Proxy running on port ${PORT}`);
});