const app = require('./app');
require('dotenv').config(); // to use ENV variables


const port = process.env.PORT || 5000;


app.listen(port, ()=>{ // set up automatically the http.createServer
    console.log(`Server is running on: ${port}`);
});



