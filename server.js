const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

let port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "8400696377",
  database: "library_db",
});

//  READ 
app.get("/library", (req, res) => {
  const q = `SELECT * FROM books`;
  db.query(q, (err, books) => {
    if (err) throw err;
    res.render("library.ejs", { books });
  });
});

// CREATE 
app.get("/library/add", (req, res) => {
  res.render("add.ejs");
});

// CREATE 
app.post("/library/add", (req, res) => {
  const { id, title, author, available_copies } = req.body;
  const q = `INSERT INTO books (id, title, author, available_copies) VALUES (?, ?, ?, ?)`;
  db.query(q, [id, title, author, available_copies], (err) => {
    if (err) throw err;
    res.redirect("/library");
  });
});

//EDIT 
app.get("/library/:id/edit", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM books WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.render("edit.ejs", { book: result[0] });
  });
});

//  UPDATE 
app.put("/library/:id", (req, res) => {
  const { title, author, available_copies } = req.body;
  const id = req.params.id;
  db.query(
    "UPDATE books SET title=?, author=?, available_copies=? WHERE id=?",
    [title, author, available_copies, id],
    (err) => {
      if (err) throw err;
      res.redirect("/library");
    }
  );
});

//  DELETE 
app.delete("/library/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM books WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.redirect("/library");
  });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
