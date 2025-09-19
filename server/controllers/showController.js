import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// API to get now playing movies from the database
export const getNowPlayingMovies = async (req, res) => {
    try {
        const moviesFromDB = await Movie.find({});
        console.log(moviesFromDB);

        const movies = moviesFromDB.map(movie => ({
            id: movie._id,
            title: movie.title,
            poster_path: movie.poster_path,
        }));

        res.json({success: true, movies: movies});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
};

// API to add a new show to the database
export const addShow = async (req, res) =>{
    try {
        const {movieId, showsInput, showPrice} = req.body

        const movie = await Movie.findById(movieId)

        if(!movie) {
            return res.json({success: false, message: "Movie not found in database."});
        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });

        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
        }

         //  Trigger Inngest event
         await inngest.send({
            name: "app/show.added",
             data: {movieTitle: movie.title}
         })

        res.json({success: true, message: 'Show Added successfully.'})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows from the database
export const getShows = async (req, res) =>{
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1 });

        const uniqueMovies = [];
        const uniqueMovieIds = new Set();

        for (const show of shows) {
            if (show.movie && !uniqueMovieIds.has(show.movie._id)) {
                uniqueMovieIds.add(show.movie._id);
                uniqueMovies.push(show.movie);
            }
        }

        res.json({success: true, shows: uniqueMovies});
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get a single show from the database
export const getShow = async (req, res) =>{
    try {
        const {movieId} = req.params;
        // get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId, showDateTime: { $gte: new Date() }})

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({success: true, movie, dateTime})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}