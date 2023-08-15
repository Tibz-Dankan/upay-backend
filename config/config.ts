import dotenv from "dotenv";
dotenv.config();

interface DatabaseConfig {
  url: string;
  dialect: "postgres";
  dialectOptions: {
    bigNumberStrings: boolean;
    ssl?: {
      require: boolean;
    };
  };
  logging?: boolean;
}

const config: { [key: string]: DatabaseConfig } = {
  // const config = {
  development: {
    url: `${process.env.DATABASE_URL_UPAY}`,
    dialect: "postgres",
    dialectOptions: {
      bigNumberStrings: true,
    },
    logging: false,
  },
  test: {
    url: `${process.env.TEST_POSTGRES_URL}`,
    dialect: "postgres",
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        require: true,
      },
    },
    logging: false,
  },
  production: {
    url: `${process.env.DATABASE_URL_UPAY}`,
    dialect: "postgres",
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        require: true,
      },
    },
  },
};

export default config;

// import { SequelizeOptions } from 'sequelize';

// const config: { [key: string]: SequelizeOptions } = {
//   development: {
//     url: process.env.DEV_DATABASE_URL || 'postgres://username:password@localhost:5432/your_database',
//     dialect: 'postgres',
//   },
//   production: {
//     url: process.env.PROD_DATABASE_URL || 'postgres://username:password@localhost:5432/your_database',
//     dialect: 'postgres',
//   },
//   test: {
//     url: process.env.TEST_DATABASE_URL || 'postgres://username:password@localhost:5432/test_database',
//     dialect: 'postgres',
//   },
// };

// export default config;
