const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const autController = require('../controllers/autController');
const router = Router();

//CREAR ESTUDIANTE EMAIL Y PASSWORD
router.get(
    '/ok',
    autController.query
);

router.post(
    '/resgister',
    autController.registrarse
)

router.post(
    '/login',
    autController.login
)

router.get('/renovarToken', validarJWT, autController.revalidarToken);


//INICIAR SESION ESTUDIANTE
// router.post(
//     '/iniSesionEst',
//     [
//         check('email', 'Email no valido').isEmail(),
//         check('password', 'La contraseña es obligatoria').not().isEmpty(),
//         validarCampos,
//     ],
//     autController.iniciarSesionEst
// );

//REVALIDAR EL TOKEN CUANDO REFRESH
// router.get('/renovarToken', validarJWT, autController.revalidarToken);



module.exports = router;