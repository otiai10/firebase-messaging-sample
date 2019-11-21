# Firebase Cloud Messaging Sample for both Server and Client

## Introduction

This is a demo of Firebase Cloud Messaging. The video on the official document website is too old and the code is not complete. You can learn how to use Firebase Cloud by learning this project. 

## Features

This project implement the server in JavaScript instead of CLI or python script.

## Usage

Step 0. If you do not have a firebase project, please read the doc and create one.

Step 1. Get `GCM Sender ID` and `FCM Server Key` in [Firebase console](https://console.firebase.google.com/).

Step 2. Replace all the "\<YOUR-PRIVATE-INFO\>" to yours. Such as Server public key in **server.js:69**. You can find this in your firebase project settings. 
PS: At the begin of **main.js**,  **firebaseConfig** can be replaced by your config which you can find when you create the firebase project.

Step 3. 

```sh
node server.js
```

Step 4. 

Visit **localhost:8080**. Follow the guild on the website.

For example:

- Click "**Request Permission**" button you can get Instance Token in browser's console.
- Send message by postman / JS / curl / firebase website. You can see the dialog.
- Click "**Trigger Push**" button you can see the message from the server.

Step 5.

Explore firebase by yourself and Have fun!