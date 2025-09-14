const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database successfully");
});

// API Endpoints
app.get("/todos", (req, res) => {
    db.query('SELECT * FROM todoitems', (err, result) => {
        if (err) return res.status(500).send("Error fetching data");
        res.json(result);
    });
});

app.post("/additem", (req, res) => {
    const { text } = req.body;
    const query = 'INSERT INTO todoitems (itemdescription) VALUES (?)';
    db.query(query, [text], (err, result) => {
        if (err) return res.status(500).send("Error adding data");
        res.send("Item added successfully");
    });
});

app.delete("/deleteitem/:id", (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todoitems WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send("Error deleting item");
        res.send(`Item with ID ${id} deleted successfully`);
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
