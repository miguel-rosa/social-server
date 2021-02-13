
exports.up = async function(knex) {
  return knex.schema.createTable('user_posts', (table) => {
    table.increments('id').primary();

    table.integer('user_id').notNullable().references('id').inTable('users');
    table.integer('post_id').notNullable().references('id').inTable('posts');
})
};

exports.down = async function(knex) {
  return knex.schema.dropTable('user_posts')
};
