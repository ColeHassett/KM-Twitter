# KM Twitter

# Which Application You Chose and Why
For this assessment, I chose to work on the twitter API project. I picked this project simply because I found it to be the most interesting of the three. The topic interested me and I wanted to test myself by working with an API in NodeJS.

# Running the Application
1. npm init
2. Obtain Twitter api keys here: https://developer.twitter.com/en/apply-for-access
3. Follow Twitters instructions to create an app and obtain your keys
4. Enter your keys into "assets/twitter_info.js"
5. node server.js
6. Go to localhost:8080 in a browser

# OS and Libraries
This was written with Windows OS in mind. NPM packages used are Express, Pug, Socket.IO, and Twitter.

# Design Decisions/Clarifications
There are three different search types that I chose to include individual buttons for ease of use. Amount is an optional field on all searches:
1. I chose to include an additional "Find Users" that just returns all users matching the string in the "Username" input.
2. The "Search Tweets" function can be used by entering a string into the "Term" input and selecting "Find Tweets".
3. The "Search User's Tweets" function can be used by entering a string into the "Username" input and selecting "Find User Tweets".

Most portions of the outputted cards can be clicked including images to get to their profile and text of a tweet to navigate to the tweet.

# Requirements
Again, all that is required to run this is NPM and the Express, Pug, Socket.IO, and Twitter packages. After installing NPM simply run npm init to install all the packages.
