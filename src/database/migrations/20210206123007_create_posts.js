
exports.up = async function(knex) {
  return knex.schema.createTable('posts', table => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('description');
  })
};

exports.down = async function(knex) {
  return knex.schema.dropTable('posts')
};
