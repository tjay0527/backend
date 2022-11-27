//server code. Express framework
import express from 'express';
import cors from 'cors';
import movies from './api/movies.route.js';

const app = express();//create express application

//.use() => middleware
app.use(cors());//handles Cross-Origin Resource Sharing requests
app.use(express.json());// let's us work with JSON in Express

app.use("/api/v1/movies", movies);//reqs with this prefix will be sent to the movies.route.js
app.use('*', (req, res) => {
    res.status(404).json({error: "not found"});//all other URLS receive 404
})

export default app;