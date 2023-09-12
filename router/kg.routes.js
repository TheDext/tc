const Router = require("express").Router;
const router = new Router();
const cheerio = require("cheerio");
const { getHtml } = require("../parse");

const kgCarsEndpoint = "https://www.mashina.kg";

router.get("/", async (req, res) => {
  try {
    const $ = await getHtml(
      kgCarsEndpoint + "/search/?year_from=2018",
      ".search-results-table"
    );
    const items = [];

    $(".list-item").each((_, elem) => {
      const carItem = cheerio.load($.html(elem));

      const link = carItem("a").attr("href").slice(9);
      const img =
        carItem(".image-wrap img").attr("data-src") ||
        carItem(".image-wrap img").attr("src");
      const name = carItem("h2.name").text();
      const price = carItem(".block.price strong").text();
      const params = carItem(".item-info-wrapper").text();

      items.push({ link, img, name, price, params });
    });
    const pagesQuantity = $(".pagination .page-item a")
      .eq(-1)
      .attr("data-page");
    const carsQuantity = Number(
      $(".show-results input").attr("value").split(" ")[1]
    );
    res.send({ cars: items, pagesQuantity, carsQuantity });
  } catch (error) {
    res.send(error);
  }
});

router.get("/search", async (req, res) => {
  try {
    const $ = await getHtml(getQueryString(req.query), ".search-results-table");
    const items = [];

    $(".list-item").each((_, elem) => {
      const carItem = cheerio.load($.html(elem));

      const link = carItem("a").attr("href").slice(9);
      const img =
        carItem(".image-wrap img").attr("data-src") ||
        carItem(".image-wrap img").attr("src");
      const name = carItem("h2.name").text();
      const price = carItem(".block.price strong").text();
      const params = carItem(".item-info-wrapper").text();

      items.push({ link, img, name, price, params });
    });
    const pagesQuantity = $(".pagination .page-item a")
      .eq(-1)
      .attr("data-page");
    const carsQuantity = Number(
      $(".show-results input").attr("value").split(" ")[1]
    );

    res.send({ cars: items, pagesQuantity, carsQuantity });
  } catch (error) {
    res.send(error);
  }
});
router.get("/details/:carId", async (req, res) => {
  const { carId } = req.params;
  try {
    const images = [];
    const imagesHtml = await getHtml(
      `${kgCarsEndpoint}/details/${carId}`,
      ".fotorama img"
    );
    const configurationHtml = await getHtml(
      `${kgCarsEndpoint}/details/${carId}`,
      ".configuration .column"
    );
    imagesHtml(".fotorama img").each((_, elem) => {
      const img = imagesHtml(elem).attr("src");
      images.push(img);
    });
    const configuration = configurationHtml(".configuration").html();
    console.log("images", images);
    console.log("configuration", configuration);
    res.send({ images, configuration });
  } catch (error) {}
});

function getQueryString({ brand, model, year, priceFrom, priceTo, page }) {
  let queryString = `${kgCarsEndpoint}/search/${brand}/${model}/?year_from=${year}&page=${page}&`;
  if (priceFrom) queryString += `price_from=${priceFrom}&`;
  if (priceTo) queryString += `price_to=${priceTo}&`;
  console.log("queryString", queryString);
  return queryString;
}

module.exports = router;
