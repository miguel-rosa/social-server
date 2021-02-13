const jwt = require('jsonwebtoken');
const knex = require('../database/connection');

module.exports.TokenController = class TokenController {
  async create(request, response){
    const {username, password} = request.body;
    
    const user = await knex('users').where('username', username).first();

    if(!user) return response.status(404).send({message:"Usuário ou senha inválidos"})
    if(user.password !== password) return response.json({auth:false, message:"Senha incorreta"})
    const token = jwt.sign({ username, password }, process.env.SECRET, {expiresIn: 1500});

    return response.json({auth:true, token:token})
  }

  async validate(request, response) {
    const token = request.headers.authorization;

    
    if(!token) return  response.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if(err) return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
      return response.status(200).send({auth: true, message: 'authenticate token.' })
    });

  }
}