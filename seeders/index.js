"use strict";
const bcrypt = require("bcrypt");
const { DATE } = require("sequelize");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("users", [
            {
                username: "elsakrismonti",
                password: await bcrypt.hash("1234567890", 10),
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: "elsakrismonti123",
                password: await bcrypt.hash("1234567890", 10),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("users", null, {});
    },
};
