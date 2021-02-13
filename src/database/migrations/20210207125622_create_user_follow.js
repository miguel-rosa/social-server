
exports.up = async function(knex) {
  return knex.schema.createTable('user_follow', (table) => {
    table.increments('id').primary();

    table.integer('user_follower_id').notNullable().references('id').inTable('users');
    table.integer('user_followed_id').notNullable().references('id').inTable('users');
})
};

exports.down = async function(knex) {
  return knex.schema.dropTable('user_follow')
};
