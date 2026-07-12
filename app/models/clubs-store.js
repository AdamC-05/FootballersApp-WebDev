'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const clubsStore = {
  store: new JsonStore('./models/clubs-store.json', { teams: [] }),
  collection: 'teams', 
  array: 'players',   

  getAllClubs() {
    return this.store.findAll(this.collection);
  },

  getClub(id) {
    return this.store.findOneBy(this.collection, (team) => team.id === id);
  },
  
  getClubsByLeague(league, userid) {
    return this.store.findBy(
    this.collection,
    (club => 
      club.league &&
      club.userid === userid &&
      club.league.toLowerCase() === league.toLowerCase()
    )
  );
},
  
  addPlayer(ClubId, player) {
    this.store.addItem(this.collection, ClubId, this.array, player);
},
  
  async addClub(club, response) {
  try {
      //call uploader function; returns an image url
      club.picture = await this.store.uploader(club);

      //add to JSON file, then return to teams controller
      this.store.addCollection(this.collection, club);
      response();
    } 
   
    catch (error) {
      logger.error("Error processing club:", error);
      response(error);
    }
  },
    
  
  removePlayer(clubId, playerId) {
  this.store.removeItem(this.collection, clubId, this.array, playerId);
},
  
  removeClub(clubId) {
  const club = this.getClub(clubId);  
  this.store.removeCollection(this.collection, club);
},
  
  
  updatePlayer(clubId, playerId, updatedPlayer) {
  this.store.editItem(this.collection, clubId, playerId, this.array, updatedPlayer);
},

  getUserPlaylists(userid) {
    return this.store.findBy(this.collection, (club => club.userid === userid));
},


};

export default clubsStore;

