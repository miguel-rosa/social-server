const knex = require('../database/connection');
const jwt = require('jsonwebtoken');

module.exports.FollowController = class FollowController {
  async create(request, response){

    const token = request.headers.authorization;
    
    
    const username = jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if(err) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      return decoded.username
    });
    
    const {followerId, followedId} = request.body;
    
    
    const userCheck = await knex('users').where('id', followerId).first('username')
    
    if(username !== userCheck.username) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    const alreadyExist = await knex('user_follow').where({
      'user_follower_id': followerId,
      'user_followed_id': followedId}
    ).first();

    

    if(alreadyExist ) return response.status(401).send({ message: 'Você já está seguindo' });

    const trx = await knex.transaction();

    const userFollow = {
      user_follower_id: followerId,
      user_followed_id: followedId
    }

    const insertedIds = await trx('user_follow').insert(userFollow);
    
    await trx.commit();
    return response.status(200).send({message:"Agora você está seguindo!"});

  }
  async delete(request, response){
    const token = request.headers.authorization;

    const username = jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if(err) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      return decoded.username
    });

    const {followerId, followedId} = request.body;
    const followerUsername = await knex('users').where('id', followerId).first('username')

    if(username !== followerUsername) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    await knex('user_follower').del().where(
      {
        'user_follower_id': followerId,
        'user_followed_id': followedId
      }
    );
  }
  async listFollowing(request, response) {
    const {id} = request.params;

    const following = await knex('user_follow')
      .join('users', 'users.id', '=', 'user_follow.user_followed_id')
      .where('user_follower_id', id)
      .select(
        "user_followed_id",
        "username",
        "image",
      );    
    return response.json(following)
  }
  async listFollowers(request, response) {
    const {id} = request.params;

    const followers = await knex('user_follow')
      .join('users', 'users.id', '=', 'user_follow.user_follower_id')
      .where('user_followed_id', id)
      .select(
        "user_follower_id",
        "username",
        "image",
      );
    
    return response.json(followers)
  }
}