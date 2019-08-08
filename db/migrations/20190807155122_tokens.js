
exports.up = async function(knex) {
  await knex.schema.createTable('tokens', table => {
    table.uuid('tokenId').notNullable().primary();
    table.uuid('userId').references('userId').inTable('users').notNull().onDelete('cascade');
    table.string('token');
    table.string('refreshToken');
    table.string('status');
    table.timestamps(true, true);
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('tokens');
};
