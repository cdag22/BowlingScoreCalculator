# Bowling Score Calculator

### A Clientside Rendering React, Node/Express Application

View deployed site on heroku [here](http://bowlingscorecalculator.herokuapp.com). **NOTE** &rarr; it may take heroku 20 or so seconds to start up the application if it hasn't been viewed recently.

### How to Run

1. Clone the repo [here](https://github.com/cdag22/BowlingScoreCalculator.git)
2. From your terminal run ```npm install``` then ```npm start``` from your terminal application to build the webpack bundle and start the server
4. Navigate to [http://localhost:3000](http://localhost:3000) and calculate some bowling scores!

### App Structure

```
|- build/ --> folder exposed through server/index.js to the browser. Contains the bundled app and html
|    |- client.bundle.js
|    |- index.html
|
|- client/
|    |- index.jxs --> bundle entry point
|    |- components/
|    |    |- app.jsx --> root JSX component
|    |    |- buttonPanel.jsx
|    |    |- keypad.jsx
|    |    |- scoreBouard.jsx
|    |- styles
|         |- style.css
|
|- server/
|    |- index.js --> express server
|
|- webpack.config.js
|- .babelrc
```