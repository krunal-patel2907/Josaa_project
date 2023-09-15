const express = require("express");
const path = require("path");

const app = express();

// Bodyparser middleware
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// will set up static folder here
app.use(express.static(path.join(__dirname, "public")));

// setting up templating engines
app.set("view engine", "ejs");
app.set("views", "views");

// setting up database connection
const db = require("./util/database");

// handling all routes
app.get("/", (req, res, next) => {
  // res.send('Hey');
  res.render("index");
});

app.get("/about-us", (req, res, next) => {
  res.render("about-us");
});

app.get("/query1", (req, res, next) => {
  res.render("queries/query1");
});

app.post("/querySubmitter", (req, res, next) => {
  const institute = req.body.institute;
  const specialisation = req.body.specialisation;
  const round = req.body.round;
  const seatType = req.body.seatType;
  console.log(institute, specialisation, round, seatType);
  res.redirect(
    `/querySubmitter?institute=${institute}&specialisation=${specialisation}&round=${round}&seatType=${seatType}`
  );
});

app.get("/querySubmitter", (req, res, next) => {
  // first run the query on MySQL server and get the data you want to put into the graph
  const institute = req.query.institute;
  const specialisation = req.query.specialisation;
  const round = req.query.round;
  const seatType = req.query.seatType;

  db.execute(
    "SELECT year, opening_rank, closing_rank FROM josaa_data.josaa WHERE institute = ? AND program = ? AND seat_type = ? AND round = ? ORDER BY year;", [institute, specialisation, seatType, round]
  ).then((rows, fieldData) => {
    // console.log(rows);
    const data = rows[0];
    // console.log(data);
    // parsing the result into arrays
    const years = data.map(data => data.year);
    const opening_rank = data.map(data => data.opening_rank);
    const closing_rank = data.map(data => data.closing_rank);

    // console.log(years);
    // console.log(opening_rank);
    // console.log(closing_rank);

    res.render("queryHandlers/query1Handler", {
      years: years,
      opening_rank: opening_rank,
      closing_rank: closing_rank,
      institute: institute,
      program: specialisation,
      round: round,
      seatType: seatType
    });

  }).catch(err => {
    console.log(err);
  });
});


app.get("/query2", (req, res, next) => {
  res.render("queries/query2");
});

app.post("/queryInstitute", (req, res, next) => {
  const specialisation = req.body.specialisation;
  const round = req.body.round;
  const seatType = req.body.seatType;
  console.log(specialisation, round, seatType);
  res.redirect(
    `/queryInstitute?specialisation=${specialisation}&round=${round}&seatType=${seatType}`
  );
});

app.get("/queryInstitute", (req, res, next) => {
  // first run the query on MySQL server and get the data you want to put into the graph
  const specialisation = req.query.specialisation;
  const round = req.query.round;
  const seatType = req.query.seatType;

  db.execute(
    "SELECT year, institute, AVG(opening_rank) AS Avg_opening_rank, AVG(closing_rank) AS Avg_closing_rank FROM josaa WHERE round = ? AND program = ? AND seat_type = ? GROUP BY year, institute ORDER BY year;", [round, specialisation, seatType]
  ).then((rows, fieldData) => {
    const data = rows[0];
    // parsing the result into arrays
    const years = data.map(data => data.year);
    const institutes = data.map(data => data.institute);
    const avg_opening_rank = data.map(data => data.Avg_opening_rank);
    const avg_closing_rank = data.map(data => data.Avg_closing_rank);

    console.log(years);
    console.log(institutes);
    console.log(avg_opening_rank);
    console.log(avg_closing_rank);

    res.render("queryHandlers/query2handler", {
      years: years,
      avg_opening_rank: avg_opening_rank,
      avg_closing_rank: avg_closing_rank,
      institutes: institutes,
      program: specialisation,
      round: round,
      seatType: seatType
    });

  }).catch(err => {
    console.log(err);
  });
});

app.get("/query3", (req, res, next) => {
  res.render("queries/query3");
});

app.post("/queryRounds", (req, res, next) => {
  const institute = req.body.institute;
  const specialisation = req.body.specialisation;
  const round = req.body.round;
  const seatType = req.body.seatType;
  console.log(institute, specialisation, round, seatType);
  res.redirect(
    `/queryRounds?institute=${institute}&specialisation=${specialisation}&round=${round}&seatType=${seatType}`
  );
});

app.get("/queryRounds", (req, res, next) => {
  // first run the query on MySQL server and get the data you want to put into the graph
  const institute = req.query.institute;
  const specialisation = req.query.specialisation;
  const round = req.query.round;
  const seatType = req.query.seatType;

  db.execute(
    "SELECT year, opening_rank, closing_rank FROM josaa_data.josaa WHERE institute = ? AND program = ? AND seat_type = ? AND round = ? ORDER BY year;", [institute, specialisation, seatType, round]
  ).then((rows, fieldData) => {
    // console.log(rows);
    const data = rows[0];
    // console.log(data);
    // parsing the result into arrays
    const years = data.map(data => data.year);
    const opening_rank = data.map(data => data.opening_rank);
    const closing_rank = data.map(data => data.closing_rank);

    // console.log(years);
    // console.log(opening_rank);
    // console.log(closing_rank);

    res.render("queryHandlers/query3Handler", {
      years: years,
      opening_rank: opening_rank,
      closing_rank: closing_rank,
      institute: institute,
      program: specialisation,
      round: round,
      seatType: seatType
    });

  }).catch(err => {
    console.log(err);
  });
});


// error controller -> to handle unnecessary url's
app.use((req, res, next) => {
  res.status(404).render("error");
});

// starting the server
app.listen(3000);
