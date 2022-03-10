const { connection } = require('../server');

const createCharge = async (req, res) => {

    const { idCard, category, date, money, title, idUser } = req.body;
    console.log(req.body)
    const newDate = new Date(date)

    const stmt = `INSERT INTO Charges(idCard, category, date, money, title, FK_idUser)  VALUES ?  `;
    const todos = [
        [idCard, category, newDate, money, title, idUser],
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

    const sql = `SELECT category, date, money, title, label, value FROM Charges left JOIN Users ON Charges.FK_idUser = Users.idUser left JOIN Cards ON Charges.idCard = Cards.idCard Where Charges.FK_idUser = ?`;

    connection.query(sql, [id], function (err, result) {
        if (err) throw err;
        res.json({ ok: true, result })
    });
}


module.exports = {
    getChargeByUser,
    createCharge
};
