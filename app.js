const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3030;

const connectionString = 'mongodb://dharani:dharani@mongodb:27017';
const dbName = 'test';
const collectionName = 'people';

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
    </head>
    <body>
        <form id="loginForm" method="post" action="/login">
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br>
            <button type="submit" id="loginButton">Login</button>
        </form>

        <script>
            document.getElementById("loginForm").addEventListener("submit", function(event) {
                event.preventDefault(); // Prevent the default form submission behavior

                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;

                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/login", true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            alert(xhr.responseText);
                        } else {
                            alert(xhr.responseText); 
                        }
                    }
                };
                xhr.send("email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));
            });
        </script>
    </body>
    </html>
    `;

    res.send(htmlContent);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const client = new MongoClient(connectionString);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ email });

        if (!user || user.password !== password) {
            res.status(401).send('Invalid email or password');
        } else {
            res.status(200).send('Login Successful');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// connection string = 'mongodb://dharani:dharani@mongodb:27017'

// connection string = 'mongodb://dharani:dharani@mongodb:27017'