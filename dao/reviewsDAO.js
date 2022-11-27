//query the MongoDB database for reviews data
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO{
    static async injectDB(conn){
        if(reviews){
            return;
        }
        try{
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews');
        } catch(e){
            console.error(`Unable to establish connection handle in reviewsDA: ${e}`);
        }
    }

    //add a new review of a movie
    static async addReview(movieId, user, review, date){
        try{
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: ObjectId(movieId)//impoort from mongodb module to create a MongoDB ID object
            }
            return await reviews.insertOne(reviewDoc);//insertOne: mongoDB API call
        }
        catch(e) {
            console.error(`Unable to post review: ${e}`)
            return {error: e};
        }
    }

    // update an old review
    static async updateReview(reviewId, user, review, date){
        try{
            const filter = {
                name: user.name,
                user_id: user._id,
                _id: ObjectId(reviewId)}
            const options = {
                $set:{
                    review: review,
                    date: date
                }
            }
            return await reviews.updateOne(filter,options);//updateOne: mongoDB API call
        }
        catch(e) {
            console.error(`Unable to update review: ${e}`)
            return {error: e};
        }
    }

    //delete an old review
    static async deleteReview(reviewId, user){
        try{
            const filter = {
                user_id: user._id,
                _id: ObjectId(reviewId)}
            return await reviews.deleteOne(filter);//deleteOne: mongoDB API call
        }
        catch(e) {
            console.error(`Unable to delete review: ${e}`)
            return {error: e};
        }
    }
}