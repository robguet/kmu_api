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

const registrarse = async (req, res) => {
    const { name, budget, cutDate, email, password } = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);


    const stmt = `INSERT INTO Users(name, budget, cutDate, email, password)  VALUES ?  `;
    const values = [
        [name, budget, cutDate, email, hash],
    ];


    connection.query(stmt, [values], async (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        const stmt2 = `INSERT INTO Users_Cards(label, value, FK_idUser, fk_idCard)  VALUES ('Efectivo', 'efectivo', '${results.insertId}', '3')  `;

        connection.query(stmt2, async (err, results2, fields) => {
            if (err) {
                return console.error(err.message);
            }
            const token = await generarJWT(results.insertId);
            res.json({ ok: true, token })
        });

    });

}

const login = async (req, res) => {
    const { email, password } = req.body;
    var adr = email;
    var sql = 'SELECT * FROM Users WHERE email = ?';
    connection.query(sql, [adr], async function (err, result) {
        if (err) throw err;

        const validarPassword = bcrypt.compareSync(password, '$2a$10$hvwLPgpyAE5PaeSeEyURjOA2uESOureqFwr.B29wkQjJ1WZnsLGMi'); // true

        if (result.length < 1) {
            return res.json({ ok: false, message: "No se encontro ningun usuario", result: result.length })
        }

        if (!validarPassword) { return res.json({ ok: false, validarPassword, res }) }

        const token = await generarJWT(result[0].idUser);
        res.json({ validarPassword, ok: true, token })

    });
}

const revalidarToken = async (req, res) => {
    const uid = req.uid;

    try {
        //generar un nuevo token
        const token = await generarJWT(uid);


        var adr = uid;
        var sql = 'SELECT idUser, name, email, budget, cutDate, label, value, fk_idCard FROM Users_Cards INNER JOIN Users on Users_Cards.FK_idUser = Users.idUser INNER JOIN Cards on Users_Cards.fk_idCard = Cards.idCard Where Users_Cards.FK_idUser = ?';
        connection.query(sql, [adr, adr], async function (err, result) {
            if (err) throw err;

            if (result.length < 1) {
                return res.json({ ok: false, message: "No se encontro ningun usuario", result: result.length })
            }

            [userInfor] = result
            const { idUser, name, email, cutDate, budget } = userInfor
            const user = {
                idUser, name, email, cutDate, budget
            }


            const cards = result.map(data => {
                return {
                    value: data.value,
                    label: data.label,
                    fk_idCard: data.fk_idCard
                }
            })

            res.json({ ok: true, token, user, cards });

        });

    } catch (error) {
        res.json({ error: true })
    }
}



module.exports = {
    query,
    registrarse,
    login,
    revalidarToken
};
