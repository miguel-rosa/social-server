const knex = require('../database/connection');
const fs = require('fs');
const path = require('path')
const jwt = require('jsonwebtoken');

module.exports.PostsController = class PostsController {
  async show(request, response){

    const {id} = request.params;

    const post = await knex('posts').where('id', id).first();
    if(!post) return response.status(404).send({message:"Nenhum post encontrado"})
    const serializedPost = {
      id:post.id,
      image:`${process.env.URL}/uploads/${post.image}`,
      description:post.description
    }

    return response.json(serializedPost)
  }

  async feed(request, response){  

    const {per_page=3, page=1, offset} = request.query
    const {id} = request.body

    const pagination = offset || page*per_page - per_page
    
    const posts = await knex('posts as p')
      .join('user_posts as up', 'p.id', '=', 'up.post_id')
      .join( 'user_follow as uf', 'u.id', '=', 'uf.user_followed')
      .join('users as u','u.id', '=', 'up.user_id')
      .orderBy('p.id', 'desc')
      .select(
        'p.id as post_id',
        'u.id as user_id',
        'u.username as user_username',
        'u.image as user_image',
        'p.image as post_image',
        'p.description as post_description'
        )
      // .paginate({perPage:10, currentPage:page})
      .limit(per_page)
      .offset(pagination)
      ;


    const serializedPosts = posts.map( post => {
      return {
        id:post.post_id,
        author:{
          id:post.user_id,
          username:post.user_username,
          image:`${process.env.URL}/uploads/${post.user_image}`,
        },
        image:`${process.env.URL}/uploads/${post.post_image}`,
        description:post.post_description
      }
    });

    return response.json(serializedPosts)
  }

  async list(request, response){  

    const {
      per_page=3,
      page=1,
      offset
    } = request.query

    const pagination = offset || page*per_page - per_page
    
    const posts = await knex('posts as p')
      .join('user_posts as up', 'p.id', '=', 'up.post_id')
      .join('users as u','u.id', '=', 'up.user_id')
      .orderBy('p.id', 'desc')
      .select(
        'p.id as post_id',
        'u.id as user_id',
        'u.username as user_username',
        'u.image as user_image',
        'p.image as post_image',
        'p.description as post_description'
        )
      // .paginate({perPage:10, currentPage:page})
      .limit(per_page)
      .offset(pagination)
      ;


    const serializedPosts = posts.map( post => {
      return {
        id:post.post_id,
        author:{
          id:post.user_id,
          username:post.user_username,
          image:`${process.env.URL}/uploads/${post.user_image}`,
        },
        image:`${process.env.URL}/uploads/${post.post_image}`,
        description:post.post_description
      }
    });

    return response.json(serializedPosts)
  }
 
  async create(request, response){

    const {legend} = request.body;
    const token = request.headers.authorization;
    
    const username = jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if(err) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      return decoded.username
    });
    
    const {id} = await knex('users').where('username', username).first();

    const post = {
      image: request.file.filename,
      description: legend
    };

    const trx = await knex.transaction();

    const insertedIds = await trx('posts').insert(post);
    
    const post_id = insertedIds[0];

    const userPosts = {
      user_id:id,
      post_id:post_id
    }
    
    await trx('user_posts').insert(userPosts);

    await trx.commit();

    return response.status(200).send({message:'file uploaded'});

  }
  async delete(request, response){
    const {id} = request.params;
    
    const token = request.headers.authorization;
  
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if(err) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }); 
    
    const {image} = await knex('posts').where('id', id).first();
           
    fs.unlink(path.resolve(__dirname, '../', '../', 'uploads', `./${image}`), (err) => {
      if (err) return response.status(500).send({message:"Error, try again"})
    });
    
    await knex('posts').del().where('id', id);
    await knex('user_posts').del().where('post_id', id);
    
    return response.status(200).send({message:"Post deletado"});
  }
}
