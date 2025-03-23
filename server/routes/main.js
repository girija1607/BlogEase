const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Home Route
router.get('', async (req, res) => {
   
    try{
        const locals = {
            title: 'Node.js Blog',
            description: 'Simple blog built with Node.js, Express, and MongoDB'
        };

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([
            {
                $sort: {createdAt: -1}
            }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
   
        res.render('index',  
            {locals, 
            data,
        current: page,
    nextPage: hasNextPage ? nextPage : null,
    currentRoute: '/'
});
    }catch(error){
        console.log(error);
    }

   
});

router.get('/post/:id', async (req, res) => {
    
    try{
        
        let slug = req.params.id;

        const data = await Post.findById({_id: slug});


        const locals = {
            title: data.title,
            description: 'Simple blog built with Node.js, Express, and MongoDB'

        }

        
        res.render('post',  {locals, data, currentRoute: `/post/${slug}`});
    }catch(error){
        console.log(error);
    }

   
});

router.post('/search', async (req, res) => {
    try{
        const locals = {
            title: 'Search',
            description: 'Simple blog built with Node.js, Express, and MongoDB'
        }

         let searchTerm = req.body.searchTerm;

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');
          




        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        })
        res.render("search", {locals, data});
    }catch(error){
        console.log(error);
    }

   
});

// Function to Insert Sample Post Data After DB Connection
/*async function insertPostData() {
    try {
        // Check if data already exists to prevent duplicates
        const existingPosts = await Post.find();
        if (existingPosts.length > 0) {
            console.log("📌 Data already exists, skipping insertion.");
            return;
        }

        // Insert sample blog posts
        await Post.insertMany([
            {
                title: "Building APIs with Node.js",
                body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
            },
            {
                title: "Deployment of Node.js applications",
                body: "Understand different ways to deploy Node.js apps, including cloud, containers, and more."
            },
            {
                title: "Authentication & Authorization in Node.js",
                body: "Learn how to implement authentication and authorization using Passport.js and JWT."
            },
            {
                title: "Working with MongoDB and Mongoose",
                body: "Learn how to efficiently use MongoDB with Mongoose in Node.js applications."
            },
            {
                title: "Building Real-Time Apps with Socket.io",
                body: "Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
            },
            {
                title: "Understanding Express.js",
                body: "Learn how to use Express.js, a powerful Node.js web framework, for building web applications."
            },
            {
                title: "Asynchronous Programming in Node.js",
                body: "Understand async/await, Promises, and non-blocking I/O in Node.js."
            },
            {
                title: "Introduction to Node.js Architecture",
                body: "Understand how Node.js works and why it is popular among developers."
            },
            {
                title: "Rate Limiting in Node.js",
                body: "Learn how to implement rate limiting in your Node.js apps to protect against DDoS attacks."
            },
            {
                title: "Using Morgan - HTTP Request Logger in Node.js",
                body: "Understand how to use Morgan to log HTTP requests in your Express applications."
            }
        ]);

        console.log("✅ Sample posts inserted successfully!");
    } catch (error) {
        console.error("❌ Error inserting posts:", error);
    }
}*/

// About Route
router.get('/about', (req, res) => {
    res.render('about', {currentRoute: '/about'});
});

module.exports = router;
//module.exports.insertPostData = insertPostData;
