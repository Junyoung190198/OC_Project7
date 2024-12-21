const { constants } = require("crypto");

const defineRelationships = (sequelize)=>{
    const {Employees, Posts, Media, EmployeeAccount, Reactions} = sequelize.models;

    EmployeeAccount.hasMany(Posts, {foreignKey:'EmployeeAccountID', constraints: false});
    Posts.belongsTo(EmployeeAccount, {foreignKey:'EmployeeAccountID', constraints: false});

    Posts.hasMany(Media, {foreignKey:'PostID', constraints: false});
    Media.belongsTo(Posts, {foreignKey:'PostID', constraints: false});

    Employees.hasOne(EmployeeAccount, {foreignKey:'EmployeeAccountID', constraints: false});
    EmployeeAccount.belongsTo(Employees, {foreignKey:'EmployeeAccountID', constraints: false});

    EmployeeAccount.hasMany(Reactions, {foreignKey:'EmployeeAccountID', constraints: false});
    Reactions.belongsTo(EmployeeAccount, {foreignKey:'EmployeeAccountID', constraints: false});

    Posts.hasMany(Reactions, {foreignKey:'PostID', constraints: false});
    Reactions.belongsTo(Posts, {foreignKey:'PostID', constraints: false});
};

module.exports = defineRelationships;
