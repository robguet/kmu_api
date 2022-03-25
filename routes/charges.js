const { Router } = require('express');
const { createCharge, getChargeByUser, getChargesByCategory, getChargesByCards } = require('../controllers/chargesController');
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

router.post(
    '/:id/get/:category',
    getChargesByCategory
);

router.post(
    '/:id/byCards',
    getChargesByCards
);

module.exports = router;