const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
var path = require("path");

const PORT = process.env.PORT || 3001;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populate", { useNewUrlParser: true });


app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
        .then(workouts => {
           
            res.json(workouts);
        })
        .catch(({message}) => {
            console.log(message);
        })
})

app.post("/api/workouts", ({body}, res) => {
    

    db.Workout.create(body)
        .then(workout => {
            console.log(workout);
            res.json(workout);
        })
        .catch(({message}) => {
            console.log(message);
        });
});

app.put("/api/workouts/:id", (req, res) => {
   
    const id = req.params.id;
    
    db.Exercise.create(req.body)
        .then((workout) => {
            db.Workout.findByIdAndUpdate( id , {$push: { exercises: workout._id }}, { new: true })
            .then(workoutDb => {
                // db.Workout.findByIdAndUpdate( id , {}, { new: true })

                data = {
                    totalDuration: 0,
                    numExercises: 0
                }
                
                if (workoutDb.totalDuration) {
                    data.totalDuration = workoutDb.totalDuration + req.body.duration;
                    data.numExercises++;
                } else {
                    data.totalDuration = req.body.duration;
                    data.numExercises = 1;
                }
                db.Workout.findByIdAndUpdate( id , data, { new: true })
                    .then(workoutDb => {
                        res.json(workoutDb);
                    })
                
            })
        
        })
})

app.get("/api/workouts/range", (req, res) => {
   
    db.Workout.find({})
        .populate("exercises")
        .then(workoutDb => {
            res.json(workoutDb);
        })
        .catch(err => {
            res.json(err);
        })
});


app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/stats.html"));
});


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
})