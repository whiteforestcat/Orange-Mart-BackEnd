const pool = require("../db/db")

// DISPLAY ALL ITEMS IN GALLERY TO SELL
const allItems = async (req, res) => {
    try {
        const items = await pool.query("SELECT * FROM gallery_items")
        res.json(items.rows)
    } catch (error) {
        console.log(error.message)
    }
}



module.exports = {allItems}