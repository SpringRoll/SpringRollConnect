import { Router } from 'express';

module.exports = Router().get('/', (_, res) => res.render('docs'));
