const { Sequelize } = require('sequelize');
const db = require('../config/db');
const { DataTypes } = Sequelize;

const BusinessProfile = db.define('BusinessProfile', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'member',
            key: 'mid',
        },
        onDelete: 'CASCADE'
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    business_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    company_address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zip_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    staff_size: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    business_profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    media_gallery: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    media_gallery_type: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: true,
    },

}, {
    tableName: 'business_profiles',
    timestamps: true,
});

module.exports = BusinessProfile;
