'use strict';

import logger from "./utils/logger.js";
import express from 'express';
import accounts from './controllers/accounts.js';



const router = express.Router();


import start from './controllers/start.js';
import teams from './controllers/teams.js';
import about from './controllers/about.js';
import clubs from './controllers/clubs.js';
import search from './controllers/search.js';




router.get('/start', start.createView);
router.get('/teams', teams.createView);
router.get('/about', about.createView);
router.get('/team/:id', clubs.createView);
router.get('/search', search.createView);
router.get('/club/:id', clubs.createView);
router.get('/club/:id/deleteplayer/:playerid', clubs.deletePlayer);
router.get('/teams/deleteclub/:id', teams.deleteClub);
router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);


router.post('/searchCategory', search.findResult);
router.post('/club/:id/addplayer', clubs.addPlayer);
router.post('/teams/addclub', teams.addClub);
router.post('/club/:clubId/updateplayer/:id', clubs.updatePlayer);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);


router.get('/error', (request, response) => response.status(404).end('Page not found.'));

export default router;
