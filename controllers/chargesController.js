const { connection } = require('../server');

const createCharge = async (req, res) => {

    const { idCard, category, date, money, title, idUser, FK_idCategory } = req.body;
    const newDate = new Date(date)

    const stmt = `INSERT INTO Charges(idCard, date, money, title, FK_idUser, FK_idCategory)  VALUES ?  `;
    const todos = [
        [idCard, newDate, money, title, idUser, FK_idCategory],
    ];

    connection.query(stmt, [todos], async (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        res.json({ ok: true, results })
    });
}

const getChargeByUser = async (req, res) => {
    const { id } = req.params
    const { startDate, endDate } = req.body;

    const sql = `SELECT date, money, title,  Cards.label, Categories.color, Categories.label, icon FROM Charges 
    left JOIN Users ON Charges.FK_idUser = Users.idUser 
    left JOIN Cards ON Charges.idCard = Cards.idCard
    left JOIN Categories ON Charges.FK_idCategory = Categories.idCategory
    Where Charges.FK_idUser = ${id}
    AND date BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY date DESC`;

    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ ok: true, result })
    });
}

const getChargesByCategory = async (req, res) => {
    const { id, category } = req.params
    const { startDate, endDate } = req.body;

    const sql = `SELECT date, money, title,  Cards.label, Categories.color, Categories.label, icon FROM Charges 
    left JOIN Users ON Charges.FK_idUser = Users.idUser left JOIN Cards ON Charges.idCard = Cards.idCard
    left JOIN Categories ON Charges.FK_idCategory = Categories.idCategory
    Where Charges.FK_idUser = ${id}
    AND category = '${category}'
    AND date BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY date DESC`;

    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ ok: true, result })
    });
}

const getChargesByCards = async (req, res) => {
    const { id } = req.params
    const { startDate, endDate } = req.body;

    const sql = `SELECT money, label, value FROM Charges 
    left JOIN Cards ON Charges.idCard = Cards.idCard
    Where Charges.FK_idUser =  ${id}
    AND date BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY date DESC`;

    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ ok: true, result })
    });
}

const getListCharges = (req, res) => {
    const sql = 'SELECT * FROM Categories'

    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ ok: true, result })
    });
}

module.exports = {
    createCharge,
    getChargeByUser,
    getChargesByCategory,
    getChargesByCards,
    getListCharges
};
