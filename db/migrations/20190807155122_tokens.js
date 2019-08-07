
exports.up = async function(knex) {
  await knex.schema.createTable('tokens', table => {
    table.uuid('tokenId').notNullable().primary();
    table.string('userId').unique();
    table.string('token');
    table.string('refreshToken');
    table.string('status');
    table.timestamps();
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('tokens');
};
