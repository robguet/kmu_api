const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const autController = require('../controllers/autController');
const router = Router();

router.post(
    '/register',
    autController.signUp
)

router.post(
    '/login',
    autController.signIn
)

router.get(
    '/',
    autController.query
)

router.get('/newToken', validarJWT, autController.newToken);

router.post('/update/user/:id', autController.update);

router.get('/startServer', autController.startServer);

module.exports = router;