'use strict';

import logger from '../utils/logger.js';
import clubsStore from '../models/clubs-store.js';
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';

const clubs = {

  createView(request, response) {
    const clubId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug('Team id = ' + clubId);
    
    const club = clubsStore.getClub(clubId);

    if (!club) {
      return response.status(404).send("Team not found");
    }

    const viewData = {
      title: club.name,
      club,
      clubId: club.id,
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };

    response.render('clubs', viewData);
  },

  
  addPlayer(request, response) {
    const clubId = request.params.id;
    const club = clubsStore.getClub(clubId);

    if (!club) {
      return response.status(404).send("Team not found");
    }

    const newPlayer = {
      id: uuidv4(),
      name: request.body.name, 
      position: request.body.position,  
      goals: request.body.goals,
      assists: request.body.assists,
      years_at_club: request.body.years_at_club 
    };

    clubsStore.addPlayer(clubId, newPlayer); 
    response.redirect('/club/' + clubId); 
  },
  
  deletePlayer(request, response) {
  const clubId = request.params.id;
  const playerId = request.params.playerid;
  logger.debug(`Deleting Player ${playerId} from Club ${clubId}`);
  clubsStore.removePlayer(clubId, playerId);
  response.redirect(`/club/${clubId}`);
},
  
updatePlayer(request, response) {
  const playerId = request.params.id;  
  const clubId = request.params.clubId;
  
  logger.debug(`Updating player ${playerId} in club ${clubId}`);

  const club = clubsStore.getClub(clubId);
  if (!club) {
    return response.status(404).send("Team not found");
  }

  const updatedPlayer = {
    id: playerId,
    name: request.body.name,
    position: request.body.position,
    goals: Number(request.body.goals),
    assists: Number(request.body.assists),
    years_at_club: Number(request.body.years_at_club)
  };

  clubsStore.updatePlayer(clubId, playerId, updatedPlayer);
  response.redirect(`/club/${clubId}`);
}


};

export default clubs;
