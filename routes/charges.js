const { Router } = require('express');
const { createCharge, getChargeByUser } = require('../controllers/chargesController');
const router = Router();

//CREAR NUEVO CARGO
router.post(
    '/new',
    createCharge
);

router.post(
    '/:id/get',
    getChargeByUser
);

module.exports = router;