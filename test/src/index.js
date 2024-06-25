const express = require("express");
const path = require("path");
const collection = require("./config"); // Ensure this points to the correct file
const bcrypt = require('bcrypt');

const app = express();

// Convert data into JSON format
app.use(express.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the views directory
app.set('views', path.join(__dirname, '../views'));

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

// Register User
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await collection.findOne({ name: username });

        if (existingUser) {
            return res.render("signup", { error: 'User already exists. Please choose a different username.' });
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
        res.status(500).render("signup", { error: "Internal Server Error" });
    }
});

// Render login page
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.render("login", { error: "User name not found" });
        }

        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.render("login", { error: "Wrong Password" });
        } else {
            // Serve the home.html file from the views directory
            return res.sendFile(path.join(__dirname, '../views/home.html'));
        }
    } catch (error) {
        console.error("Error in login route:", error);
        res.status(500).render("login", { error: "Internal Server Error" });
    }
});

// Define port for application
const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
