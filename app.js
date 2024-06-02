const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const path = require('path');
const ejs = require('ejs')
// const fs = require('f?s')
const app = express();

// Body parser middleware
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static('public'));
app.use('/public',express.static('public'))
// app.use(express.static(path.join(__dirname,'public')))
// Connect to MongoDB

mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log("There is an error"+err));

// Define a schema and model for your data
const User = mongoose.model('User', {
    name: String,
    email: String,
    phone: String,
    address: String,
    password: String
});
const FormData = mongoose.model('FormData', {
    name:String,
    source: String,
    destination: String,
    contact:String
});

// Define routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/intro.html');
});
app.get('/login.html',(req,res)=>{
    res.sendFile(__dirname + "/login.html")
    // res.render("/index.html")    
})
app.get('/index.html',(req,res)=>{
    res.render(__dirname + "/index.html")
    // res.render("/index.html")
})
app.get('/forgot.html',(req,res)=>{
    res.sendFile(__dirname + "/forgot.html")
    // res.render("/index.html")
})
app.get('/feedback.html',(req,res)=>{
    res.sendFile(__dirname + "/feedback.html")
    // res.render("/index.html")
})
app.get('/services.html',(req,res)=>{
    res.sendFile(__dirname + "/services.html")
})
app.get('/choose.html',(req,res)=>{
    res.sendFile(__dirname+"/choose.html")
})
app.get('/about.html',(req,res)=>{
    res.sendFile(__dirname + "/about.html")
})
app.get('/contact.html',(req,res)=>{
    res.sendFile(__dirname + "/contact.html")
})
app.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/login.html')
    // res.redirect('.index.html')
})
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname + '/signup.html')
})
app.get('/chat',(req,res)=>{
    res.sendFile(__dirname + '/chat.html')
})
app.get('/signout.html',(req,res)=>{
    res.sendFile(__dirname + '/signout.html')
})
app.get('/commute.ejs',(req,res)=>{
    res.render("/commute")
})
// app.get('/submit',(req,res)=>{
//     res.render("choose.html")
// })
// app.get('/contact.html#',(req,res)=>{
//     res.send("Thank you for your time we'll contact you shortly")
// })
app.post('/submit', (req, res) => {
    const { name,source, destination,contact } = req.body;
    const newFormData = new FormData({
        name,
        source,
        destination,
        contact
    });

    newFormData.save()
        .then(() => res.send("Data has been stored"))
        .catch(err => res.status(400).send('Error: ' + err));
    });
    // Signup route
app.post('/signup', (req, res) => 
{
    const { name, email, phone, address, password } = req.body;

    // Create a new user instance
    const newUser = new User({
        name,
        email,
        phone,
        address,
        password
    })
    newUser.save()
        .then(() => res.send('Signup successful'))
        .catch(err => res.status(400).send('Error: ' + err));
});
    
// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username, password })
    .then(user => {
        if (user) {
                res.sendFile(__dirname+'/index.html')
            } else {
                res.status(401).send('Invalid username or password');
            }
        })
        .catch(err => res.status(400).send('Error: ' + err));
});
// Route to fetch and display list of data from the database
// Route to fetch user data and render the HTML page


// Set up static file serving for HTML page
app.get('/commute', async (req, res) => {
    try {
        // Fetch data from the database
        const users = await FormData.find(); 
        console.log("The data has been fetched")
        // Render the 'commute' page with the fetched data
        res.render('commute', { users });
        console.log("The data is rendered")
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
})

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
