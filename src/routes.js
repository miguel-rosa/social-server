const express = require('express');
require("dotenv-safe").config();

const multer = require('multer');
const multerConfig = require('./config/multer');
const {PUT_USER, POST_POST} = require('./config/celebrate')

const upload = multer(multerConfig);

const { UsersController } = require('./controllers/usersController');
const { PostsController } = require('./controllers/postsController');
const { TokenController } = require('./controllers/tokenController');
const { FollowController } = require('./controllers/followController');
// const { CommentsController } = require('./controllers/commentsController');

const routes = express.Router();

const usersController = new UsersController();
const postsController = new PostsController();
const tokenController = new TokenController();
const followController = new FollowController();
// const commentsController = new CommentsController();

routes.get('/v1/user', usersController.list);
routes.get('/v1/user/:username', usersController.show);
routes.put('/v1/user/:id', upload.single('image'), PUT_USER, usersController.edit);
routes.post('/v1/user', usersController.create);
routes.get('/v1/user_validate/', usersController.validate);

routes.post('/jwt-auth/v1/token', tokenController.create);
routes.get('/jwt-auth/v1/token/validate', tokenController.validate);

routes.get('/v1/posts', postsController.list);
routes.get('/v1/feed', postsController.feed);
routes.get('/v1/posts/:id', postsController.show);
routes.post('/v1/posts',upload.single('image'), POST_POST, postsController.create);
routes.delete('/v1/posts/:id', postsController.delete);

routes.get('/v1/followers/:id', followController.listFollowers)
routes.get('/v1/following/:id', followController.listFollowing)
routes.post('/v1/follow', followController.create);
routes.delete('/v1/unfollow', followController.delete);
// routes.get('/v1/comments')

module.exports = routes