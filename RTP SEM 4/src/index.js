const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});


// Register User
// Register User
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await collection.findOne({ name: username });

        if (existingUser) {
            return res.send('User already exists. Please choose a different username.');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await collection.create({
            name: username,
            password: hashedPassword
        });

        console.log("New user registered:", newUser);
        
        // Redirect to login page after successful signup
        res.redirect("/login");
    } catch (error) {
        console.error("Error in signup route:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Render login page
app.get("/login", (req, res) => {
    res.render("login");
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});


// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});