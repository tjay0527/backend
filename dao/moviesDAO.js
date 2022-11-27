//query the MongoDB database for movies data
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let movies;

export default class MoviesDAO{
    static async injectDB(conn){
        if(movies){
            return;
        }
        try{//MOVIEREVIEWS_NS=movie_time_db
            movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection('movies');
        }
        catch(e) {
            console.error(`Unable to connect in MoviesDAO: ${e}`);
        }
    }

    static async getMovies({
            filters = null,
            page = 0,
            moviesPerPage = 20,
        } = {} ){//empty object is default parameter in case arg is undefined

        let query;
        if(filters){//construct query based on title, rated filter values passed in
            if("tittle" in filters){
                query = {$text: { $search: filters['tittle']}};
            } else if("rated" in filters){
                query = {"rated": {$eq: filters['rated']}}
            }
        }
        
        //actual query
        let cursor;//MobgoDB cursor obj which can iterate over a db and return incremental results
        try{
            cursor = await movies.find(query)
                                 .limit(moviesPerPage)
                                 .skip(moviesPerPage * page);
            const moviesList = await cursor.toArray();//sequence of movies returned with the cursor
            const totalNumMovies = await movies.countDocuments(query);
            return {moviesList, totalNumMovies};
        } catch(e){
            console.error(`Unable to issue find command, ${e}`);
            return {moviesList: [], totalNumMovies: 0};
        }
    }

    static async getRatings(){
        let ratings = [];
        try{
            ratings = await movies.distinct("rated");
            return ratings;
        } catch(e){
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }

    static async getMovieById(id){
        try{
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next();
        } catch(e){
            console.error(`Something went wrong in getMovieById: ${e}`);
            throw e;
        }
    }
}

