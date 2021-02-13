
exports.up = async function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('description');
    table.string('name');
    table.string('image');
  })
};

exports.down = async function(knex) {
  return knex.schema.dropTable('users')
};