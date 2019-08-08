
exports.up = async db => {
  await db.schema.createTable('users', table => {
    table.uuid('userId').notNullable().primary();
    table.string('email').unique();
    table.string('phone').unique();
    table.string('password');
    table.string('google_token');
    table.string('full_name');
    table.string('identity_number');
    table.string('nation');
    table.string('cities');
    table.string('gender');
    table.dateTime('date_of_birth');
    table.string('origin');
    table.string('status');
    table.boolean('is_phone_verified');
    table.boolean('is_email_verified');
    table.string('created_by');
    table.string('updated_by');
    table.timestamps(true, true);
  })
};

exports.down = async table => {
  await table.schema.dropTableIfExists('users');
};
