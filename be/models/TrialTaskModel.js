import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Trialtask = db.define('trialtask', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    uuid: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255],
        }
    },
    part_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255],
        }
    },
    visual_image: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    tanggalIn: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    tanggalCek: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    remark_image: {
        type: DataTypes.TEXT,
        defaultValue: null,
    }
    ,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    note: {
        type: DataTypes.STRING,
        defaultValue: null,
        validate: {
            len: [0, 250],
        }
    },
}, {
    freezeTableName: true,
});

Users.hasMany(Trialtask, { foreignKey: 'userId' });
Trialtask.belongsTo(Users, { foreignKey: 'userId' });

export default Trialtask;
