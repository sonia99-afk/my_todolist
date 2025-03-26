const express = require("express");
const app = express();
const cors = require('cors');
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');

const db_url = "mongodb://127.0.0.1:27017/";

function connect() {
    const mongoClient = new MongoClient(db_url);

    try {
        mongoClient.connect();
        const db = mongoClient.db("db");
        return db;
    } catch(err) {
        console.log(err);
    } finally {
        // mongoClient.close();
    }
}

let db = connect();

function get_todo_from_db() {
    var stream = db.collection('todo').find({});
    return stream.toArray();
}

function add_todo_to_db(id,text) {
    db.collection('todo').insertOne({'id': id, 'text': text});
}

function update_todo_in_db(id,text) {
    db.collection('todo').updateOne({'id': id},{$set: {'text': text}});
}

function delete_todo_from_db(id) {
    db.collection('todo').deleteOne({'id': id});
}

app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get("/task", (req, res) => {
    get_todo_from_db().then(function(items) {
        res.end(JSON.stringify(items));
    });
});

app.post("/task", (req, res) => {
    get_todo_from_db().then(function(items) {
        add_todo_to_db(items.length > 0 ? items[items.length - 1].id + 1 : 1, req.body.text);
        res.end('OK');
    });
});

app.put("/task/:id", (req, res) => {
    update_todo_in_db(+req.params.id, req.body.text);
    res.end('OK');
});

app.delete("/task/:id", (req, res) => {
    delete_todo_from_db(+req.params.id);
    res.end('OK');
});

app.listen(8000, ()=> { console.log("app started")})


