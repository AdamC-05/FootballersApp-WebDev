'use strict';

import logger from '../utils/logger.js';
import userStore from '../models/user-store.js';
import { v4 as uuidv4 } from 'uuid';
import clubsStore from '../models/clubs-store.js';
import cloudinary from 'cloudinary';
import util from 'util';

const uploadToCloudinary = util.promisify(cloudinary.uploader.upload);

const accounts = {

  index(request, response) {
    const clubs = clubsStore.getAllClubs();
    const users = userStore.getAllUsers();

    const numClubs = clubs.length;
    const numUsers = users.length;

    let totalPlayers = 0;
    clubs.forEach(club => {
      totalPlayers += club.players.length;
    });

    const avgPlayers = numClubs > 0 ? (totalPlayers / numClubs).toFixed(2) : 0;

    const viewData = {
      title: 'Login or Signup',
      stats: {
        totalClubs: numClubs,
        totalPlayers: totalPlayers,
        totalUsers: numUsers,
        avgPlayers
      }
    };

    logger.info("Rendering index with Football App stats");
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('playlist', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    console.log('Register route reached');  
    const user = request.body; 
    user.id = uuidv4();

    if (request.files && request.files.picture) {
      const picturePath = request.files.picture.path; 

      uploadToCloudinary(picturePath)
        .then(result => {
          user.picture = result.secure_url; 
          console.log('Image uploaded to Cloudinary:', result.secure_url);
        })
        .catch(err => {
          console.error('Cloudinary upload error:', err);
          user.picture = '';
        });
    }

    userStore.addUser(user);

    response.cookie('playlist', user.email);

    logger.info('Registering and logging in ' + user.email);

    response.redirect('/start');
  },


  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    const inputPassword = request.body.password;

    if (user && user.password === inputPassword) {
      response.cookie('playlist', user.email);
      logger.info('logging in ' + user.email);
      response.redirect('/start');
    } else {
      logger.info('Authentication failed for ' + request.body.email);
      response.redirect('/login');
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return userStore.getUserByEmail(userEmail);
  }
};

export default accounts;
