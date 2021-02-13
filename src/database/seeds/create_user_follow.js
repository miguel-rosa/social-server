
exports.seed = function(knex) {
  return knex('user_follow').insert([
    {user_follower_id: 1, user_followed_id:32},
    {user_follower_id: 1, user_followed_id:33},
    {user_follower_id: 1, user_followed_id:34},
    {user_follower_id: 1, user_followed_id:35},
    {user_follower_id: 35, user_followed_id:1},
  ]);
};
