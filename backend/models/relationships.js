const { constants } = require("crypto");

const defineRelationships = (sequelize)=>{
    const {Employees, Posts, Media, EmployeeAccount, Reactions, MarkAsRead} = sequelize.models;

    EmployeeAccount.hasMany(Posts, {foreignKey:'EmployeeAccountID', as: 'posts', constraints: false});
    Posts.belongsTo(EmployeeAccount, {foreignKey:'EmployeeAccountID', as: 'author',constraints: false});

    Posts.hasMany(Media, {foreignKey:'PostID', as: 'media',constraints: false});
    Media.belongsTo(Posts, {foreignKey:'PostID', as: 'post',constraints: false});

    Employees.hasOne(EmployeeAccount, { foreignKey: 'EmployeeID', as: 'account', constraints: false });
    EmployeeAccount.belongsTo(Employees, { foreignKey: 'EmployeeID', as: 'employee', constraints: false });    

    EmployeeAccount.hasMany(Reactions, {foreignKey:'EmployeeAccountID', as: 'reactions',constraints: false});
    Reactions.belongsTo(EmployeeAccount, {foreignKey:'EmployeeAccountID', as: 'account',constraints: false});

    Posts.hasMany(Reactions, {foreignKey:'PostID', as: 'reactions',constraints: false});
    Reactions.belongsTo(Posts, {foreignKey:'PostID', as: 'post',constraints: false});

    EmployeeAccount.hasMany(MarkAsRead, {foreignKey:'EmployeeAccountID', as: 'isRead', constraints: false});
    MarkAsRead.belongsTo(EmployeeAccount, {foreignKey:'EmployeeAccountID', as: 'account', constraints: false});

    Posts.hasMany(MarkAsRead, {foreignKey:'PostID', as: 'isRead',constraints: false});
    MarkAsRead.belongsTo(Posts, {foreignKey:'PostID', as: 'post',constraints: false});
};

module.exports = defineRelationships;
