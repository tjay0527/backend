let favoritesCollection;

export default class FavoritesDAO {
    static async injectDB (conn) {
        if (favoritesCollection) {
            return;
        }
        try{
            favoritesCollection = await conn.db(process.env.MOVIEREVIEWS_NS)
                                            .collection('favorites');
        }
        catch (e) {
            console.error(`Unable to connect in FavoritesDAO: ${e}`);
        }
    }

    static async updateFavorites (userId, favorites) {
        try {
            const updateResponse = await favoritesCollection.updateOne (
                { _id: userId },
                { $set: { favorites: favorites }},
                { upsert: true }//if an entry doesn't exist for the user it is created. otherwise it is updated.
            )
            return updateResponse
        }
        catch(e) {
            console.error (`Unable to update favorites: ${e}`);
            return { error: e };
        }
    }

    static async getFavorites(id) {
        let cursor;
        try {
            cursor = await favoritesCollection.find({
                _id: id
            });
            const favorites = await cursor.toArray();
            // There will only ever be one value returned, which will represent the list of favorites. For this reason we only ever need to take the 0 indexed element of the returned array.
            return favorites[0];
        } catch(e) {
            console.error (`Something went wrong in getFavorites: ${e}`);
            throw e;
        }
    }
}