const express = require('express');

const shortid = require('shortid');
// use shortid.generate() to create randomized id

const server = express();

const port = process.argv[2] || 5000;

const db = require('./database');

server.use(express.json());


// ------------------------------ API/USERS ENDPOINTS -------------------------
server.get('/api/users', (req,res)=>{
    res.status(200).json(db.getUsers());
});

server.post('/api/users', (req, res)=>{
    const newUser = {
        id:shortid.generate(),
        name:req.body.name,
        bio:req.body.bio
    };
    req.body.name === "" || req.body.bio === "" ?
        (res.status(400).json({errorMessage:"Please provide name and bio for the user."})) :
        db.createUser(newUser);

    db.getUserById(newUser.id) ? res.status(201).json(db.getUserById(newUser.id)) :
        res.status(500).json({errorMessage:"There was an error while saving the user to the database"})

    res.end();
})
// ------------------------------ END API/USERS ENDPOINTS -------------------------



// ------------------------------ API/USERS/:ID ENDPOINTS -------------------------

server.get('/api/users/:id', (req,res)=>{
    !db.getUsers().find(u=> u.id === req.params.id) ? res.status(404).json({message:"The user with the specified ID does not exist"}) : !db.getUserById(req.params.id) ?
        res.status(500).json({errorMessage:"The user information could not be retrieved"}) :
        res.status(200).json(db.getUserById(req.params.id));
});

server.delete('/api/users/:id', (req, res)=>{
    let deletedUser = {}
    !db.getUsers().find(u=>u.id === req.params.id) ?
        res.status(404).json({message:"The user with the specified ID does not exist."}) :
        (deletedUser=db.getUserById(req.params.id),
            db.deleteUser(req.params.id) ?
                res.status(500).json({errorMessage:"The user could not be removed"}) :
            res.status(200).json(deletedUser))
})

server.put('/api/users/:id', (req,res)=>{
    let userUpdate={}
    console.log(`body name is ${req.body.name}`);
    !db.getUsers().find(u=>u.id===req.params.id) ?
        res.status(404).json({message:"The user with the specified ID does not exist"}):
        req.body.name === undefined || req.body.bio === undefined ?
            res.status(400).json({errorMessage:"Please provide name and bio for the user"}) :
            (userUpdate = {name:req.body.name,bio:req.body.bio}
            ,db.updateUser(req.params.id,userUpdate) ? res.status(200).json(db.getUserById(req.params.id)):
            res.status(500).json({errorMessage:"The user information could not be modified"}));
})

// ------------------------------ END API/USERS/:ID ENDPOINTS -------------------------

server.listen(port, ()=>{
    console.log(`server running on port: ${port}`)
})