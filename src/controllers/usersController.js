const knex = require('../database/connection');
const jwt = require('jsonwebtoken');

module.exports.UsersController = class UsersController {
  async list(request, response) {
    const users = await knex('users').select('*');  
    const serializedUsers = users.map(user => ({
      id:user.id,
      username:user.username,
      email:user.email,
      password:user.password,
      description:user.description,
      name:user.name,
      image:user.image ? `${process.env.URL}/uploads/${user.image}` : null

    }))
    return response.json(serializedUsers);
  }

  async show(request, response) {
    const {username} = request.params;
    const token = request.headers.authorization
    console.log('token', token)
    
    const user = await knex('users').where('username', username).first();

    let userFollow = false;

    if(token !== 'null'){
      console.log('token', token === 'null')
      const userFollowerName = jwt.verify(
          token,
          process.env.SECRET,
          (err, decoded) => {
            if(err) return 
            return decoded.username
          }
        )
        console.log('userFollow', userFollowerName)
        const userFollower = await knex('users').where('username', userFollowerName).first('id');
        console.log('userFollow', userFollow)
        
        const followedResult = await knex('user_follow')
          .where({
            'user_follower_id': userFollower.id,
            'user_followed_id': user.id})
          .first()      
          userFollow = followedResult ? true : false
    }
    
    
    if(!user) return response.status(400).json({message: "User not found"});
    const {id} = user;

    const posts = await knex('posts')
      .join('user_posts', 'posts.id', '=', 'user_posts.post_id')
      .where('user_posts.user_id', id)
      .orderBy('posts.id', 'desc')
      .select('*')
      

    const serializedPosts = posts.map( post => ({
      id:post.post_id,
      image:`${process.env.URL}/uploads/${post.image}`,
      description:post.description
    }))

    const serializedUser = {
      id:user.id,
      username:user.username,
      email:user.email,
      description:user.description,
      name:user.name,
      image:user.image ? `${process.env.URL}/uploads/${user.image}` : null,
      userFollow:userFollow,
      posts:serializedPosts

    }
    
    return response.json(serializedUser);
  }


  async create(request, response){

    const {email, name, username, password} = request.body;

    const DEFAULT_USER_IMAGE = 'default_user_image.png'

    const usernameAlreadyInUse = await knex('users').where('username', username).first() || false;
    if(usernameAlreadyInUse) return response.status(400).json({message: "Nome de usuário já está em uso"});
    
    const emailAlreadyInUse = await knex('users').where('username', email).first() || false;
    if(emailAlreadyInUse) return response.status(400).json({message: "Email já está em uso"});

    const trx = await knex.transaction();
    
    const user = {email, name, username, password, image:DEFAULT_USER_IMAGE};

    const insertedIds = await trx('users').insert(user);

    const user_id = insertedIds[0];

    await trx.commit();
    
    return response.status(200).json({message: "Usuário criado"})
    
  }

  async validate(request, response) {
    
    const token = request.headers.authorization;
    
    if(!token) return  response.status(401).send({ auth: false, message: 'No token provided.' });
    
    const username = jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if(err) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      return decoded.username
    });
    
    const user = await knex('users').where('username', username).first();

    if(!user) return  response.status(401).send({ auth: false, message: 'Usuário inválido' });

    const serializedUser = {
      id:user.id,
      username:user.username,
      name:user.name,
      email:user.email,
      description:user.description,
      image:user.image ? `${process.env.URL}/uploads/${user.image}` : null,
    }

    return response.json(serializedUser);
    
  }

  async edit(request, response){

    const token = request.headers.authorization;
    const {id} = request.params;

    if(!token) return  response.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, err => {
      if(err) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    });

    const {name, description} = request.body;

    const user = {
      image: request.file.filename,
      name,
      description
    }

    await knex('users').where('id', id).update(user)

    return response.status(200).send({message:"Usuário atualizado"})

  }

}