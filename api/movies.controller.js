//handle data request specific to moview
import MoviesDAO from '../dao/moviesDAO.js';
export default class MoviesController{
    //req:HTTP request obj, res:response obj, next:callback, can be called when this methods completes
    static async apiGetMovies(req, res, next){
        //set paging info
        const moviesPerPage = req.query.moviesPerPage ?
            parseInt(req.qury.moviesPerpage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        //set filters info
        let filters = {}
        if (req.query.rated){
            filters.rated = req.query.rated;
        } else if(req.query.title){
            filters.title = req.query.title;
        }
        
        //return a signle page's worth of movies in a list
        const { moviesList, totalNumMovies } = await
            MoviesDAO.getMovies({ filters, page, moviesPerPage});
        
        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_resutls: totalNumMovies,
        };
        res.json(response);//package it into HTTP response object
    }

    static async apiGetMovieById(req, res, next){
        try{
            let id = req.params.id || {}
            let movie = await MoviesDAO.getMovieById(id);
            if(!movie){
                res.status(404).json({error: "not found"});
                return;
            }
            res.json(movie);
        }catch(e){
            console.log(`API, ${e}`);
            res.status(500).json({error:e});
        }
    }
    //DAO query for all distinct rating to populate our ratings filter drop-down
    static async apiGetRatings(req, res, enxt){
        try{
            let propertyTypes = await MoviesDAO.getRatings();
            res.json(propertyTypes);
        } catch(e){
            console.log(`API, ${e}`);
            res.status(500).json({error: e});
        }
    }
}