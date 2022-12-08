const fs = require("fs")
const path = require("path")

var loadDatabase = (db_connection, schema = {}) => {
    const dirname = path.dirname(db_connection)
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true })
    }

    if (!fs.existsSync(db_connection)) {
        fs.writeFileSync(db_connection, JSON.stringify(schema))
    }
    const model = require(db_connection)

    var db = {
        model: model,
        filename: db_connection,
        update: () => {
            fs.writeFileSync(db_connection, JSON.stringify(model))
        }
    }
    return db
}

module.exports = loadDatabase
