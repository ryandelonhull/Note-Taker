const fs = require("fs-extra");
const express = require("express");
const path = require("path");
const cors = require("cors");
const nodemon = require("nodemon");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static("assets"));

app.get("/notes", function (req, res, next) {
  res.sendFile(path.join(__dirname, "/public/notes.html"), function (err) {
    if (err) {
      next(err);
    } else {
      next();
    }
  });
});

app.get("/api/notes", (req, res) => {
  let notes = fs.readFileSync("./db/db.json");
  if (notes.length > 0) {
    res.status(200).send(JSON.parse(notes));
  } else {
    res.status(404).send("Not found.");
  }
});

app.post("/api/notes", (req, res) => {
  let notes = fs.readFileSync("./db/db.json");
  notes = JSON.parse(notes);
  notes.unshift(req.body);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.status(201).send("Ok");
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  let notes = fs.readFileSync("./db/db.json");
  let parsedNotes = JSON.parse(notes);
  let getNoteById = parsedNotes.findIndex((note) => {
    return note.id == id;
  });
  const newNotes = parsedNotes
    .slice(0, getNoteById)
    .concat(parsedNotes.slice(getNoteById + 1, parsedNotes.length));
  fs.writeFileSync("./db/db.json", JSON.stringify(newNotes));
  res.status(204).send("Ok");
});

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
