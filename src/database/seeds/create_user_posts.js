
exports.seed = function(knex) {
  return knex('user_posts').insert([
    {user_id: 1, post_id:1},
    {user_id: 1, post_id:2},
    {user_id: 1, post_id:3},
    {user_id: 2, post_id:4}
  ]);
};
