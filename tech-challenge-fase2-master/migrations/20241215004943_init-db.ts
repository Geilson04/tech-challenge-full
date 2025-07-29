import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.enum('role', ['ADMIN', 'MEMBER']).defaultTo('MEMBER').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable('posts', (table) => {
    table.string('id').primary();
    table.string('slug').notNullable().unique();
    table.string('title').notNullable();
    table.text('content');
    table.string('author').notNullable();
    table.timestamp('publishedAt').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();

    table.uuid('userId').references('id').inTable('users').onDelete('SET NULL');
    table.index(['publishedAt'], 'idx_posts_publishedAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('users');
}
