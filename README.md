# Playdate Buddy  
Deployed at: https://main--playdate-buddy.netlify.app/  

Playdate Buddy is designed to help you search for places to take your children and read reviews left by real parents with information that you actually care about. It also allows you to make new friends and set up playdates for your children! 
**Explore new places and make new friends all through one app - so go Play!**

As a parent of a toddler I know that it can be hard to know where to take your child to play and hard to meet other parents who have children of a similar age to help your children learn how to play with others. This website aims to tackle the goal of finding suitable playdate venues/activities for parents of young children and/or schedule events with other users who also have young children. The target demographic for the app would likely be 20-50 year olds, who are possibly primarily women but not exclusively. Users would have children aged 1-10 as older children would likely not want to be at a playdate with their parents or arranged by them.

**Key Features:**
* User Map - as part of the sign up process a user will supply their city and country. This information is used show users a map of their local area with pre-marked places that a user as saved as part of the site. The map also allows users to search by name for a place to get more information.
* Place Details - when a user does view the details of a place they are shown the name, address and type of venue. The user can also choose the save the place, leave a review or schedule a playdate at that location. On top of seeing the details about the place the user is shown any existing reviews written by users as well as a list of the scheduled playdates at that location with the ability to join any existing playdates.
* User Reviews - our reviews focus on the main areas that are important to parents of small children, for example: bathroom, changing table, highchair and parking. This allows parents to be prepared for attending playdates at the location.
* Friends - users can see a list of all the users and can add friends to their page. This feature makes it easier for parents to keep track of the names of other parents they have met at playdates. This feature is also designed to allow a user to unfriend but without any notification to the other user.
* Dates - users can schedule playdates at a location and see the scheduled dates of other users for a given location. Users can also access a list of all of their scheduled dates to help them keep track of that information. The details of any given date can also be accessed to see who has signed up to attend.

**For Developers:**
Tests can be found in the backend portion of the app in a directory called tests. They can be run using jest in the command line.

**User Flow:**
* Landing Page is the Homepage - users will see a short description of the app and buttons/nav links to either login or signup. An existing user can login and will be redirected back to this page but with updated navlinks to show all of the site options as well as a link to their map and the list of users. A new user will complete the signup form and be redirected back to the homepage as a logged in returning user would.
* From the homepage a user can either view the list of users - allowing them to add to their friend list, or view their map - allowing them to search for places by name.
* If a user views their map it will display markers for any saved places they have, as well as a search bar to find somewhere new. When a user searches, a new marker will be added for that result. A user can click on a marker to see the name of the place, type of place it is and a link to get details about the chosen place.
* When a user views the details of a place they are given the option to leave a review, save the place or make a playdate there as the main options. Users can also read the reviews left by other users, delete a review left by themselves, and/or join an existing playdate.
* If a user chooses to leave a review, they are taken to the review form to complete and then redirected back to the page showing the place details. Alternatively, if they have chosen to make a playdate at that location a form will appear on the page to set the date and the user will be redirected to a page showing all of their scheduled playdates. Saving a place, removing a review or joining a playdate will update the contents of the current page and leave the user on that page.
* The navbar, in addition to giving a link to the user's map, allows users to view a list of their saved places, a list of their friends, a list of their dates, the ability to view their profile or logout.
* If a user views the list of their places, friends or dates they are then given the option to remove a place, friend or date. They will also have the option to view the details of a place or a date.
* If a user chooses to view their profile they will have the opportunity to update their profile, add child information or delete their account. When they choose to update their profile, they will be redirected to a form to change personal information and save those changes before being redirected back to their profile page. If they choose to add a child to their profile they will be redirected to a form asking for their child's gender and birthday so that the age of the child and its gender can be displayed on their profile. If they choose to delete their account they will be removed from the database and redirected to the homepage as a logged out user.
* When a user is done utilising the features of the Playdate Buddy site they can then logout using the navbar link and will be redirected to the homepage as a logged out user until next time.

**API Information:**
[Google Maps API](https://developers.google.com/maps/documentation/javascript)  
[Weavy API](https://www.weavy.com/docs)

Both of the above APIs require an API Key. The API key in both instances is free to obtain. This information is stored in a .env file for both the backend and frontend code as well as being listed as environment variables when being deployed. 

The Weavy API is not yet in full use in this application. The backend routes are designed to obtain an access token for a user when they register so that in the future a chat feature can be incorporated. As part of setting up the pieces for this future update a Weavy Server and Weavy Environment have also been included in the backend and frontend .env files respectively.

**Tech Stack:**
* Node.js
* Express.js
* React.js
* PostgreSQL
* HTML
* CSS with bootstrap

_Updates and Features to Come:_
* Include child information with parent username and information on the list of users, scheduled playdates and detailed date information.
* Set a time limit on a user being registered before child information is added to avoid having users registered without children on the application.
* Implement the Weavy chat feature so that users can communicate with each other through the app.
