
exports.up = async function(knex) {
  await knex.schema.createTable('userTypes', table => {
    table.uuid('tokenId').notNullable().primary();
    table.string('userId').unique();
    table.string('origin');
    table.timestamps();
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('userTypes');
};
