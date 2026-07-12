'use strict';

import logger from "../utils/logger.js";
import clubsStore from "../models/clubs-store.js";
import accounts from './accounts.js';
  
const getCategories = (loggedInUser) => {
  const league = [];
  const playlists = clubsStore.getUserPlaylists(loggedInUser.id);
  playlists.forEach(element => {
    if (!league.includes(element.league)) {
      league.push(element.league);
    }
  });
  return league;
}

const search = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("Search page loading!");
    
	  if (loggedInUser) {
    const viewData = {
      title: "Footballers App Search",
      league: getCategories(loggedInUser),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName
    };
    
    logger.debug(viewData.league);
    
    response.render('search', viewData);
  }
    else response.redirect('/'); 
  },
  
  findResult(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const league = request.body.league;
    logger.debug('Team League = ' + league);

    const viewData = {
      title: 'Team',
      foundPlaylists: clubsStore.getClubsByLeague(league, loggedInUser.id),
      categories: getCategories(loggedInUser),
      categoryTitle: league,
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName
    };
    
    logger.debug(viewData.foundPlaylists);
    
    response.render('search', viewData);
},
  
};


export default search;
