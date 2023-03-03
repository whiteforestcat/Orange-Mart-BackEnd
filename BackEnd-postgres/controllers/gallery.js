const pool = require("../db/db")

// DISPLAY ALL ITEMS IN GALLERY TO SELL
const allItems = async (req, res) => {
    try {
        const items = await pool.query("SELECT * FROM items")
        res.json(items.rows)
    } catch (error) {
        console.log(error.message)
    }
}

// SEARCH ENDPOINT



module.exports = {allItems}