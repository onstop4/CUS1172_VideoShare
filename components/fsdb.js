const fs = require("fs");

var loadDatabase = (db_connection, schema = {}) => {
    if (!fs.existsSync(db_connection)) {
        fs.writeFileSync(db_connection, JSON.stringify(schema));
    }
    const model = require(db_connection)

    var db = {
        model: model,
        filename: db_connection,
        update: () => {
            fs.writeFileSync(db_connection, JSON.stringify(model));
        }
    }
    return db;
}

module.exports = loadDatabase;

