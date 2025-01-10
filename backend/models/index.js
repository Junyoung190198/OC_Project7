const {sequelize} = require('../config/database');
const {connectDatabase} = require('../config/database');


const syncModels= async()=>{
    try{
        await connectDatabase();

        /**
         * Loading models to be usable in sequelize.models
         */
        require('./employees');
        require('./posts');
        require('./media');
        require('./employeeAccount');
        require('./reactions');
        require('./markAsRead');
        /**
         * Calling relationship.js to define and set relationships 
         * and associations
         */
        const defineRelationships = require('./relationships');
        defineRelationships(sequelize);

        // sync all models at once to the database,
        // using alter:false to avoid trying to alter tables
        await sequelize.sync({alter: false, force: false});
    }catch(error){
        throw error; 
    }
};
 

module.exports = syncModels;