
exports.up = async function(knex) {
  await knex.schema.createTable('identifiers', table => {
    table.uuid('identifierId').notNullable().primary();
    table.string('userId').unique();
    table.string('device');
    table.string('os');
    table.string('location');
    table.string('status');
    table.timestamps();
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('identifiers');
};
