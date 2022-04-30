const { Router } = require('express');
const { createCharge, getChargeByUser, getChargesByCategory, getChargesByCards, getListCharges } = require('../controllers/chargesController');
const router = Router();

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

router.get(
    '/get/CategoriesList',
    getListCharges
);

module.exports = router;