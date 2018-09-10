# React weather app

A simple single-page React app that pulls weather information from OpenWeatherMap's free weather and forecast APIs and (somewhat crudely) displays it in a dynamic manner. Mainly done for learning.

Uses [React](http://reactjs.org/) and [OpenWeatherMap](https://openweathermap.org/), of course, as well as [Babel](https://babeljs.io/) for in-browser conversion from JSX to JS, and [Bootstrap](http://getbootstrap.com/) for general layout and looks. Slapped together in a few hours to get the gist of React. Makes absolutely no attempt at best practices. Especially for images. Hope you like pixelation.

To start using the app, you'll have to enter an [OpenWeatherMap API key](https://openweathermap.org/api), which you can get for free. (To avoid having to enter it on every page load, you can also add the key to the empty `apiKey` prop for the WeatherApp component at the end of `weatherapp.jsx`.)
