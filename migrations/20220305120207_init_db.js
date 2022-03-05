/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("name").notNullable();
        table.string("login").notNullable();
        table.string("password");
        table.string("email").notNullable();
        table.boolean("email_is_confirmed").notNullable().defaultTo(false);
        table.string("email_confirmation_code", 6);
        table
            .enu("role", ["user", "editor", "admin"])
            .notNullable()
            .defaultTo("user");
    });

    await knex.schema.createTable("photo_gallery", (table) => {
        table.increments("id");
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());


    });

    await knex.schema.createTable("photos", (table) => {
        table.increments("id");
        table.integer("photo_gallery_id").notNullable();
        table.string("photo_path").notNullable();

        table
            .foreign("photo_gallery_id")
            .references("photo_gallery.id")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");
    });

    await knex.schema.createTable("tours", (table) => {
        table.increments("id");
        table.integer("price").notNullable();
        table.text("description").notNullable();
        table.string("name").notNullable();
        table.integer("photo_gallery_id").notNullable();

        table
            .foreign("photo_gallery_id")
            .references("photo_gallery.id")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

    });

    await knex.schema.createTable("orders", (table) => {
        table.increments("id");
        table.integer("users_id").notNullable();
        table.integer("tours_id").notNullable();
        table.integer("amount").notNullable();
        table.integer("price").notNullable();

        table
            .foreign("users_id")
            .references("users.id")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

        table
            .foreign("tours_id")
            .references("tours.id")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("orders");
    await knex.schema.dropTableIfExists("tours");
    await knex.schema.dropTableIfExists("photos");
    await knex.schema.dropTableIfExists("photo_gallery");
    await knex.schema.dropTableIfExists("users");

};
