const { generarJWT } = require('../helper/jwt');
const { connection } = require('../server');
const bcrypt = require('bcryptjs');


const query = async (req, res) => {

    connection.query('SELECT * FROM Users', (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows)
        res.json({ rows })

    });


}

const signUp = async (req, res) => {
    const { name, budget, cutDate, email, password } = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);


    const stmt = `INSERT INTO Users(name, budget, cutDate, email, password)  VALUES ?  `;
    const values = [
        [name, budget, cutDate, email, hash],
    ];

    connection.query(stmt, [values], async (err, results) => {
        if (err) {
            return console.error(err.message);
        }
        const stmt2 = `INSERT INTO Users_Cards(FK_idUser, fk_idCard)  VALUES ('${results.insertId}', '3')  `;

        connection.query(stmt2, async (err) => {
            if (err) {
                return console.error(err.message);
            }
            const token = await generarJWT(results.insertId);
            res.json({ ok: true, token })
        });

    });

}

const signIn = async (req, res) => {
    const { email, password } = req.body;
    var adr = email;
    var sql = 'SELECT * FROM Users WHERE email = ?';
    connection.query(sql, [adr], async function (err, result) {
        if (err) {
            console.log(error)
            throw err;
        }
        const user = result[0];
        const validarPassword = bcrypt.compareSync(password, user.password);

        if (result.length < 1) {
            return res.json({ ok: false, message: "No se encontro ningun usuario", res: result.length })
        }

        if (!validarPassword) { return res.json({ ok: false, validarPassword, res }) }

        const token = await generarJWT(result[0].idUser);
        res.json({ validarPassword, ok: true, token })

    });
}

const newToken = async (req, res) => {
    const uid = req.uid;
    console.log(uid)

    try {
        //generar un nuevo token
        const token = await generarJWT(uid);


        var adr = uid;
        var sql = 'SELECT idUser, name, email, budget, cutDate, label, value, investmentLimit, fk_idCard FROM Users_Cards INNER JOIN Users on Users_Cards.FK_idUser = Users.idUser INNER JOIN Cards on Users_Cards.fk_idCard = Cards.idCard Where Users_Cards.FK_idUser = ?';
        connection.query(sql, [adr], async function (err, result) {
            if (err) throw err;

            if (result.length < 1) {
                return res.json({ ok: false, message: "No se encontro ningun usuario", result: result.length })
            }

            [userInfor] = result
            const { idUser, name, email, cutDate, budget, investmentLimit } = userInfor
            const user = {
                idUser, name, email, cutDate, budget, investmentLimit
            }


            const cards = result.map(data => {
                return {
                    value: data.value,
                    label: data.label,
                    fk_idCard: data.fk_idCard
                }
            })

            user.cards = cards

            res.json({ ok: true, token, user });

        });

    } catch (error) {
        res.json({ error: true })
    }
}

const update = (req, res) => {

    const { name, email, cutDate, budget, investmentLimit, cards } = req.body
    const { id } = req.params

    const stmt = 'UPDATE Users SET name = ?, email = ?, cutDate = ?, budget = ?, investmentLimit = ? WHERE idUser = ?'

    connection.query(stmt, [name, email, cutDate, budget, investmentLimit, id], async (err) => {
        if (err) {
            return res.json({ ok: false, error: err.message });
        }

        connection.query('DELETE FROM Users_Cards WHERE FK_idUser = ? AND fk_idCard!=3', [id], function (error) {
            if (error) {
                return res.json({ ok: false, error: error.message });

            };

            const cardsWithEfectivo = cards.filter(card => {
                return card.fk_idCard !== 3
            })

            const cardsWithoutEfectivo = cardsWithEfectivo.map(card => {
                return [id, card.fk_idCard]
            })

            connection.query('INSERT INTO Users_Cards (FK_idUser, fk_idCard) VALUES ?', [cardsWithoutEfectivo], function (error, results, fields) {
                if (error) {
                    return res.json({ ok: false, error: error.message });
                }

                res.json({ ok: true, results })
            })
        })
    });





}

module.exports = {
    query,
    signIn,
    signUp,
    newToken,
    update
};
