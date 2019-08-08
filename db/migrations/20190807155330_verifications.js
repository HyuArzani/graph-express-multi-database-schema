
exports.up = async function(knex) {
  await knex.schema.createTable('verifications', table => {
    table.uuid('verificationId').notNullable().primary();
    table.uuid('userId').references('userId').inTable('users').notNull().onDelete('cascade');
    table.string('code');
    table.string('type');
    table.integer('count');
    table.string('status');
    table.string('created_by');
    table.string('updated_by');
    table.timestamps(true, true);
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('verifications');
};
