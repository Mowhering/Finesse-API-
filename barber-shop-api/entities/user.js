var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "User",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    phone: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
  },
});
