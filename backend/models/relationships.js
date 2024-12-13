
const defineRelationships = (sequelize)=>{
    const {Employees, Posts, Media, EmployeeAccount} = sequelize.models;

    EmployeeAccount.hasMany(Posts, {foreignKey:'EmployeeAccountID', constraints: false});
    Posts.belongsTo(EmployeeAccount, {foreignKey:'EmployeeAccountID', constraints: false});

    Posts.hasMany(Media, {foreignKey:'PostID', constraints: false});
    Media.belongsTo(Posts, {foreignKey:'PostID', constraints: false});

    Employees.hasOne(EmployeeAccount, {foreignKey:'EmployeeAccountID', constraints: false});
    EmployeeAccount.belongsTo(Employees, {foreignKey:'EmployeeAccountID', constraints: false});
};

module.exports = defineRelationships;
