const { constants } = require("crypto");

const defineRelationships = (sequelize)=>{
    const {Employees, Posts, Media, EmployeeAccount, Reactions} = sequelize.models;

    EmployeeAccount.hasMany(Posts, {foreignKey:'EmployeeAccountID', as: 'posts', constraints: false});
    Posts.belongsTo(EmployeeAccount, {foreignKey:'EmployeeAccountID', as: 'author',constraints: false});

    Posts.hasMany(Media, {foreignKey:'PostID', as: 'media',constraints: false});
    Media.belongsTo(Posts, {foreignKey:'PostID', as: 'post',constraints: false});

    Employees.hasOne(EmployeeAccount, {foreignKey:'EmployeeAccountID', as: 'account',constraints: false});
    EmployeeAccount.belongsTo(Employees, {foreignKey:'EmployeeAccountID', as: 'employee',constraints: false});

    EmployeeAccount.hasMany(Reactions, {foreignKey:'EmployeeAccountID', as: 'reactions',constraints: false});
    Reactions.belongsTo(EmployeeAccount, {foreignKey:'EmployeeAccountID', as: 'account',constraints: false});

    Posts.hasMany(Reactions, {foreignKey:'PostID', as: 'reactions',constraints: false});
    Reactions.belongsTo(Posts, {foreignKey:'PostID', as: 'post',constraints: false});
};

module.exports = defineRelationships;
