
const defineRelationships = (sequelize)=>{
    const {Employees, Posts, Media, Credentials} = sequelize.models;

    Employees.hasMany(Posts, {foreignKey:'EmployeeID', constraints: false});
    Posts.belongsTo(Employees, {foreignKey:'EmployeeID', constraints: false});

    Posts.hasMany(Media, {foreignKey:'PostID', constraints: false});
    Media.belongsTo(Posts, {foreignKey:'PostID', constraints: false});

    Employees.hasOne(Credentials, {foreignKey:'EmployeeID', constraints: false});
    Credentials.belongsTo(Employees, {foreignKey:'EmployeeID', constraints: false});
};

module.exports = defineRelationships;
