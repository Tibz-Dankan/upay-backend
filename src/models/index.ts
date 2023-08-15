import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./user";

const env = process.env.NODE_ENV || "development";

const sequelize = new Sequelize(`${process.env.DATABASE_URL_UPAY}`);

const models = {
  User: UserModel(sequelize, DataTypes),
  // Initialize other models similarly
};

// Set up model associations here
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, models };
