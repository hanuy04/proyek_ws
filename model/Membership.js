const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class Membership extends Model {}
Membership.init(
  {
    id_membership: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nama_membership: {
      type: DataTypes.STRING,
    },
    harga_membership: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Membership",
    tableName: "membership",
    timestamps: false,
  }
);

module.exports = Membership;
