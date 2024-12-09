const User = require('./user');
const Role = require('./role');
const {connectDatabase} = require('../config/database');




const syncModels =  async()=>{
    try{
        await connectDatabase();
        await User.sync({force: true});
        await Role.sync({alter: true});
        console.log('Models well synchronized');
    }catch(error){
        console.log(error);
    }
};
 

module.exports = syncModels;