const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 33066,
    user: "root",
    password: "vishnuyadav",
    database: "todo",
});


db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database successfully");
});

// Get all to-do items
app.get("/", (req, res) => {
    console.log("GET / request received");
    db.query('SELECT * FROM todoitems', (err, result) => {
        if (err) {
            console.error("Error occurred:", err);
            res.status(500).send("Error fetching data");
            return;
        }
        res.json(result);
    });
});

// Add a new to-do item
app.post("/additem", (req, res) => {
    const { text } = req.body;
    console.log("Request body:", req.body);

    const query = 'INSERT INTO todoitems (itemdescription) VALUES (?)';
    db.query(query, [text], (err, result) => {
        if (err) {
            console.error("Error occurred while inserting:", err);
            res.status(500).send("Error adding data");
            return;
        }
        console.log("Item added successfully");
        res.send("Item added successfully");
    });
});



// Delete a to-do item by ID
app.delete("/deleteitem/:id", (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM todoitems WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting item:", err);
            res.status(500).send("Error deleting item");
            return;
        }
        console.log(`Item with ID ${id} deleted successfully`);
        res.send(`Item with ID ${id} deleted successfully`);
    });
});


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
