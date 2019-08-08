
exports.up = async function(knex) {
  await knex.schema.createTable('identifiers', table => {
    table.uuid('identifierId').notNullable().primary();
    table.uuid('userId').references('userId').inTable('users').notNull().onDelete('cascade');
    table.string('device');
    table.string('os');
    table.string('location');
    table.string('status');
    table.timestamps(true, true);
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('identifiers');
};
