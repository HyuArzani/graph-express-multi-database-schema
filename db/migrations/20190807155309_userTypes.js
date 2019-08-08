
exports.up = async function(knex) {
  await knex.schema.createTable('userTypes', table => {
    table.uuid('tokenId').references('tokenId').inTable('tokens').notNull().onDelete('cascade');
    table.uuid('userId').references('userId').inTable('users').notNull().onDelete('cascade');
    table.string('origin');
    table.timestamps(true, true);
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('userTypes');
};
