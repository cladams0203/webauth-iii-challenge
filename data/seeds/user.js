const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "chelsea",
          department: "tl",
          password: bcrypt.hashSync("taco", 4),
        },
        {
          username: "gordon",
          department: "student",
          password: bcrypt.hashSync("rocketman", 4),
        },
        {
          username: "maria",
          department: "student",
          password: bcrypt.hashSync("sandwich", 4),
        },
      ]);
    });
};
