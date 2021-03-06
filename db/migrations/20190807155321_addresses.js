
exports.up = async function(knex) {
  await knex.schema.createTable('addresses', table => {
    table.uuid('addressId').notNullable().primary();
    table.uuid('userId').references('userId').inTable('users').notNull().onDelete('cascade');
    table.string('nation');
    table.string('province');
    table.string('cities');
    table.string('distric');
    table.string('detail');
    table.string('latitude');
    table.string('longitude');
    table.string('postCode');
    table.boolean('isDefault');
    table.string('status');
    table.string('created_by');
    table.string('updated_by');
    table.timestamps(true, true);
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('addresses');
};
