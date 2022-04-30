const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const autController = require('../controllers/autController');
const router = Router();

router.get(
    '/ok',
    autController.query
);

router.post(
    '/register',
    autController.signUp
)

router.post(
    '/login',
    autController.signIn
)

router.get('/newToken', validarJWT, autController.newToken);


module.exports = router;