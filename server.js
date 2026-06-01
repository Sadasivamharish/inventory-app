const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Inventory Backend Running");
});

app.get("/api/test-db", (req, res) => {

    db.query("SELECT * FROM item_types", (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });

});

app.post("/api/items", (req, res) => {

    const {
        name,
        purchase_date,
        stock_available,
        item_type_id
    } = req.body;

    // Validation
    if (!name || !purchase_date || !item_type_id) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    const sql = `
        INSERT INTO items
        (name, purchase_date, stock_available, item_type_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, purchase_date, stock_available, item_type_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Item Added Successfully"
            });
        }
    );
});

app.get("/api/items", (req, res) => {

    const sql = `
        SELECT
            items.id,
            items.name,
            DATE_FORMAT(items.purchase_date, '%Y-%m-%d') AS purchase_date,
            items.stock_available,
            item_types.type_name
        FROM items
        JOIN item_types
        ON items.item_type_id = item_types.id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });

});

app.delete("/api/items/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM items WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Item Deleted Successfully"
            });
        }
    );

});

app.put("/api/items/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        purchase_date,
        stock_available,
        item_type_id
    } = req.body;

    db.query(
        `UPDATE items
         SET name=?,
             purchase_date=?,
             stock_available=?,
             item_type_id=?
         WHERE id=?`,
        [
            name,
            purchase_date,
            stock_available,
            item_type_id,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Item Updated Successfully"
            });

        }
    );

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});