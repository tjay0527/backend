//top-level code for the backend. connect database and data access objects, and exception handling
import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from './dao/moviesDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';
import FavoritesDAO from './dao/favoritesDAO.js';
async function main(){
    dotenv.config();//sets up environment variables in dotenv

    //create a MongoDB client object to database's URL
    const client = new mongodb.MongoClient(
        process.env.MOVIEREVIEWS_DB_URI//process.env => to access the env variables
    )
    
    const port = process.env.PORT || 8000;//set up port

    try{
        //connect the client obj to the database
        await client.connect();//await need to be used with async keyword
        await MoviesDAO.injectDB(client);//pass client obj to DAO
        await ReviewsDAO.injectDB(client);
        await FavoritesDAO.injectDB(client);

        app.listen(port, () =>{//set the app(server) to listen at the port
            console.log('Server is Running on port: ' + port);
        })
    } catch (e){
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);