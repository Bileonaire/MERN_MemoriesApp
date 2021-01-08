import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';


import postRoutes from './routes/posts.js';

const app = express();

app.use(bodyparser.json({ limit : "30mb", extended: true}));
app.use(bodyparser.urlencoded({ limit : "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRoutes);

const PORT = process.env.PORT || 5000;
const MongoDB = 'mongodb+srv://Bileonaire:1Lomkones.@cluster0.iyr6l.mongodb.net/<dbname>?retryWrites=true&w=majority';
const CONNECTION_URL = process.env.CONNECTION_URL || MongoDB;

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port : ${PORT}`)))
    .catch((error) => console.log(error.message));

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

mongoose.set('useFindAndModify', false);