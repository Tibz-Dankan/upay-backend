import { Sequelize, DataTypes } from "sequelize";
import config from ".././../config/config";
import UserModel from "./user";

const env = process.env.NODE_ENV || "development";
console.log("process.env.DATABASE_URL_UPAY");
console.log(process.env.DATABASE_URL_UPAY);
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig);

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
