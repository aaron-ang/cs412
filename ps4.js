import express from "express";
import request from "request";
import fetch from "node-fetch"; // node-fetch supports import syntax only
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();
const weather_api_key = process.env.WEATHERSTACK_API_KEY;
const route = "/ps4";

router.use(
  express.urlencoded({
    extended: true,
  })
);

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// define the home page route
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/weather/:type", async (req, res) => {
  if (!req.body) {
    res.redirect(route);
    return;
  }

  const { location } = req.body;
  const url = `http://api.weatherstack.com/current?access_key=${weather_api_key}&query=${location}`;

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
        .then((data) => {
          const location = data.location.name;
          res.render("results", { location, ...data.current });
        })
        .catch((error) => {
          res.redirect(route);
        });
      break;

    case "b": // Async/Await
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
          res.redirect(route);
        } else {
          const location = data.location.name;
          res.render("results", { location, ...data.current });
        }
      } catch (error) {
        res.redirect(route);
      }
      break;

    case "c": // Callback
      request(url, (error, response, body) => {
        if (error) {
          res.redirect(route);
        } else {
          const data = JSON.parse(body);
          if (data.error) {
            res.redirect(route);
          } else {
            const location = data.location.name;
            res.render("results", { location, ...data.current });
          }
        }
      });
      break;
    default:
      res.redirect(route);
  }
});

export default router;
