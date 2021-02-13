
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('posts').insert([
    {
      image: 'photo-1.jpg',
      description: 'just some photos'
    },
    {
      image: 'photo-2.jpg',
      description: 'just some other photos'
    },
    {
      image: 'photo-3.jpg',
      description: 'just some other photos'
    },
    {
      image: 'photo-4.jpg',
      description: 'just some other photos'
    }
  ]);
};
