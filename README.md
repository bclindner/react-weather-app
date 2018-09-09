# React weather app

A simple single-page React app that pulls weather information from OpenWeatherMap's free weather and forecast APIs and (somewhat crudely) displays it in a dynamic manner. Mainly done for learning.

Uses [React](http://reactjs.org/) and [OpenWeatherMap](https://openweathermap.org/), of course, as well as [Babel](https://babeljs.io/) for in-browser conversion from JSX to JS, and [Bootstrap](http://getbootstrap.com/) for general layout and looks. Slapped together in a few hours to get the gist of React. Makes absolutely no attempt at best practices. Especially for images. Hope you like pixelation.

This repo is set up with a dummy key, so it won't work if you just try it as-is - to use the app, deploy it to a server and change the 'apiKey' global variable in `weatherapp.jsx` to a valid [OpenWeatherMap API key](https://openweathermap.org/api) (which you can get for free!).
