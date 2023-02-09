const { Router } = require('express');
const { createNewAccessCode, validateAccessCode } = require('../controller/phone');

const phoneRouter = Router();

phoneRouter.post('/create', createNewAccessCode);
phoneRouter.post('/validate', validateAccessCode);

module.exports = phoneRouter;
