'use strict';

import logger from "../utils/logger.js";
import clubsStore from "../models/clubs-store.js";
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';


const teams = {
  createView(request, response) {
    logger.info("Teams page loading...");
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
    const viewData = {
      title: "Football Teams",
      teams: clubsStore.getUserPlaylists(loggedInUser.id),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    
    logger.debug("Teams Data:", viewData.teams);
    
    response.render('teams', viewData);
    }
    else response.redirect('/');
  },
  
  addClub(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug(loggedInUser.id);
    const timestamp = new Date();

    const newClub = {
      userid: loggedInUser.id,
      id: uuidv4(),
      name: request.body.name,
      league: request.body.league,
      country: request.body.country,
      rating: parseInt(request.body.rating),
      players: [],
      date: timestamp,
      picture: request.files.picture,


    };
    clubsStore.addClub(newClub, function() {
    response.redirect("/teams");
    });
  },
  
  deleteClub(request, response) {
  const clubId = request.params.id; 
  logger.debug(`Deleting Club ${clubId}`);
  
  clubsStore.removeClub(clubId);
  
  response.redirect('/teams');
}



};

export default teams;

