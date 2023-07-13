import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import sqlite3 from "sqlite3";

export class PropertyTransaction extends Model<
  InferAttributes<PropertyTransaction>,
  InferCreationAttributes<PropertyTransaction>
> {
  declare id: CreationOptional<number>;
  declare projectName: string;
  declare price: number;
  declare sqft: number;
  declare psf: number;
  declare saleDate: number;
  declare streetName: string;
  declare saleType: string;
  declare areaType: string;
  declare propertyType: string;
  declare leaseType: string;
  declare leaseLength?: number;
  declare topYear?: number;
  declare district: number;
  declare marketSegment: string;
  declare lowFloorLevel: string;
  declare highFloorLevel: string;
}

export const getDbModel = () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    dialectModule: sqlite3,
    storage: "./src/app/data/propertyTransactions.db",
  });

  PropertyTransaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sqft: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      psf: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      saleDate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      streetName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      saleType: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      areaType: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      propertyType: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      leaseType: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      leaseLength: {
        type: DataTypes.INTEGER,
      },
      topYear: {
        type: DataTypes.INTEGER,
      },
      district: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      marketSegment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lowFloorLevel: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      highFloorLevel: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "transactions",
      sequelize,
      timestamps: false,
    }
  );
  return PropertyTransaction;
};
