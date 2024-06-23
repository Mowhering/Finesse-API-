var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Schedule",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    time: {
      type: "varchar",
    },
    service: {
      type: "varchar",
    },
  },
});
