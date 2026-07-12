'use strict';

import logger from "../utils/logger.js";
import appStore from '../models/app-store.js';
import clubsStore from "../models/clubs-store.js";
import accounts from './accounts.js';


const about = {
  createView(request, response) {
  const loggedInUser = accounts.getCurrentUser(request);
  logger.info("About page loading");

  const info = {
    appTitle: "Footballers App",
    version: "2.1.0",
    platform: "Mobile, Laptop, PC",
    location: "Waterford, Ireland",
    releaseDate: "2/5/2025",
    appCategory: "Sports",
    creators: [{ name: "Adam Christensen" }]
  };

  if (loggedInUser) {
    
    const userClubs = clubsStore.getUserPlaylists(loggedInUser.id);
    let numClubs = userClubs.length;
    let totalPlayers = 0;
    let maxPlayers = 0;
    let minPlayers = Infinity;
    let maxPlayersClub = null;
    let minPlayersClub = null;

    for (let club of userClubs) {
      const playersCount = club.players.length;
      totalPlayers += playersCount;

      if (playersCount > maxPlayers) {
        maxPlayers = playersCount;
        maxPlayersClub = club.name;
      }

      if (playersCount < minPlayers) {
        minPlayers = playersCount;
        minPlayersClub = club.name;
      }
    }

    if (numClubs === 0) {
      minPlayers = 0;
      minPlayersClub = "N/A";
      maxPlayersClub = "N/A";
    }

    const avgPlayersPerClub = numClubs > 0 ? totalPlayers / numClubs : 0;

    const viewData = {
      title: "About the Club App",
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      info,
      stats: {
        totalClubs: numClubs,
        totalPlayers: totalPlayers,
        avgPlayersPerClub: avgPlayersPerClub.toFixed(2),
        maxPlayers: maxPlayers,
        maxPlayersClub: maxPlayersClub,
        minPlayers: minPlayers,
        minPlayersClub: minPlayersClub
      }
    };

    response.render("about", viewData);
  } else {
    response.redirect('/');
  }
}
};

export default about;
