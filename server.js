var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();


var PORT = process.env.PORT || 6060;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var notes = require('./db/db.json')


app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});


app.get("/api/notes", function (err, res) {
    res.json(notes);
});


app.post("/api/notes", function (req, res) {
    if(notes.length){

        req.body.id = notes[notes.length-1].id + 1
    }else{
        req.body.id =1;
    }

    notes.push(req.body);
    fs.writeFile("./db/db.json", JSON.stringify(notes),  function (err) {
        if (err) throw err;
        res.sendStatus(200);
        });

    });

    app.delete("/api/notes/:id", function (req, res) {
        console.log(req.params.id)

    notes = notes.filter(note=>note.id !== parseInt(req.params.id))

    fs.writeFile("./db/db.json", JSON.stringify(notes),  function (err) {
        
        if (err) throw err;
        res.sendStatus(200);
        });
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
