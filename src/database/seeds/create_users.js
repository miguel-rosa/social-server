
exports.seed = function(knex) {
  return knex('users').insert([
    {
      username: 'miguelrosa',
      email: 'miguelrosa@gmail.com',
      password: '43243243',
      description: 'just some photos',
      name: 'Miguel Rosa',
      image: 'profile-picture-1.jpg'
    },
    {
      username: 'miguel',
      email: 'miguel@gmail.com',
      password: '43243243',
      description: 'just some other photos',
      name: 'Miguel Rosa Pereira',
      image: 'profile-picture-2.jpg'
    }
  ]);
};
