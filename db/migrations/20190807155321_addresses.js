
exports.up = async function(knex) {
  await knex.schema.createTable('addresses', table => {
    table.uuid('addressId').notNullable().primary();
    table.string('userId').unique();
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
    table.timestamps();
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('addresses');
};
