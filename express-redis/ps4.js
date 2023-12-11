import express from "express";
import request from "request";
import fetch from "node-fetch"; // node-fetch supports import syntax only
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();
const WEATHER_API_KEY = process.env.WEATHERSTACK_API_KEY;
const ROUTE = "/ps4";
const TTL = 15; // 15 seconds

const router = express.Router();
const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

router.use(
  express.urlencoded({
    extended: true,
  })
);
router.use(cors());

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// define the home page route
router.get("/", (req, res) => {
  res.render("index");
});

const duplicate = (data) => {
  // Duplicate data for Angular service\
  if (typeof data === "string") {
    data = JSON.parse(data);
  }
  const jsonCopy = JSON.parse(JSON.stringify(data));
  return [data, jsonCopy];
};

router.post("/weather/:type", async (req, res) => {
  console.log(req.body);
  if (!req.body || !req.body.location) {
    res.redirect(ROUTE);
    return;
  }

  const { location } = req.body;
  const cachedData = await client.get(location);
  if (cachedData) {
    console.log("Cache hit");
    res.json(JSON.parse(cachedData));
    return;
  }

  console.log("Cache miss");
  const url = `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${location}`;

  const renderResults = async (data) => {
    const renderData = {
      location: data.location.name,
      ...data.current,
    };
    await client.setEx(location, TTL, JSON.stringify(renderData));
    res.render("results", renderData);
  };

  switch (req.params.type) {
    case "a": // Promise
      const promise = new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            const data = JSON.parse(body);
            if (data.error) {
              reject(data.error);
            } else {
              resolve(data);
            }
          }
        });
      });
      promise
        .then(async (data) => {
          await renderResults(data);
        })
        .catch((error) => {
          console.log(error);
          res.redirect(ROUTE);
        });
      break;

    case "b": // Async/Await
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
          res.redirect(ROUTE);
        } else {
          await renderResults(data);
        }
      } catch (error) {
        console.log(error);
        res.redirect(ROUTE);
      }
      break;

    case "c": // Callback
      request(url, async (error, response, body) => {
        if (error) {
          console.log(error);
          res.redirect(ROUTE);
        } else {
          const data = JSON.parse(body);
          if (data.error) {
            res.redirect(ROUTE);
          } else {
            const duplicateData = duplicate(data);
            await client.setEx(location, TTL, JSON.stringify(duplicateData));
            res.json(duplicateData);
          }
        }
      });
      break;

    default:
      res.redirect(ROUTE);
  }
});

export default router;
