// Placeholder data.
const placeholder = {
  'dt': 0,
  'weather': [
    {
      'main': '...',
      'description': '...',
      'icon': '01d'
    }
  ],
  'main': {
    'temp': 0,
    'temp_min': 0,
    'temp_max': 0
  },
  'name': '...'
}

// Converts Kelvin to Celsius.
function toCelsius (temp) {
  return (temp - 273.15).toFixed(1)
}
// Converts Kelvin to Fahrenheit.
function toFahrenheit (temp) {
  return ((temp - 273.15) * (9 / 5) + 32).toFixed(1)
}

// Base component for the application.
class WeatherApp extends React.Component {
  constructor (props) {
    super(props)
    // Set our state (the stuff that changes, mostly)
    this.state = {
      zip: 30458,
      currentWeather: placeholder,
      forecast: [placeholder, placeholder, placeholder, placeholder]
    }
    // Bind functions that will be passed to child components
    this.handleZIPChange = this.handleZIPChange.bind(this)
  }
  // Calls the OpenWeatherMap API to get new weather and forecast info, and updates the state accordingly.
  update () {
    // Set the data to placeholder (so if an API call fails, it won't display data for the previous call)
    this.setState({
      currentWeather: placeholder,
      forecast: [placeholder, placeholder, placeholder, placeholder]
    })
    // Get weather data, convert to JSON, then set it in the state
    fetch('https://api.openweathermap.org/data/2.5/weather?appid=' + this.props.apiKey + '&zip=' + this.state.zip)
      .then(res => res.json())
      .then(json => this.setState({currentWeather: json}))
    // Same as above but with forecast data.
    fetch('https://api.openweathermap.org/data/2.5/forecast?appid=' + this.props.apiKey + '&zip=' + this.state.zip)
      .then(res => res.json())
      .then(json => this.setState({forecast: json.list}))
  }
  // Changes the ZIP code for the weather, then refreshes OpenWeatherMap information.
  handleZIPChange (newZip) {
    this.setState({
      zip: newZip
    }, this.update)
  }
  // Run an initial update when the component mounts.
  componentDidMount () {
    this.update()
  }
  render () {
    return (
      <div class='container border shadow my-3 p-3'>
        <WeatherHeader handleZIPChange={this.handleZIPChange} />
        <hr />
        <WeatherDisplay currentWeather={this.state.currentWeather} />
        <hr />
        <WeatherForecastList data={this.state.forecast} />
        <hr />
        <WeatherFooter />
      </div>
    )
  }
}

// Bootstrap row displaying a title and the search bar.
class WeatherHeader extends React.Component {
  render () {
    return (
      <header class='row'>
        <div class='col-md-3'>
          <h1 class='text-center text-md-left font-weight-light'>Weather</h1>
        </div>
        <div class='col-md-9'>
          <WeatherSearchBar handleZIPChange={this.props.handleZIPChange} />
        </div>
      </header>
    )
  }
}

// ZIP code entry field which updates the WeatherApp component with new ZIPs
class WeatherSearchBar extends React.Component {
  constructor (props) {
    super(props)
    // Bind the verify function so it can be used in the render
    this.verify = this.verify.bind(this)
  }
  // Verify the data, then update the ZIP if valid.
  verify (event) {
    let el = event.target
    let value = el.value
    // ZIP codes are always 5 digits
    if (value.length !== 5) {
      el.classList.add('is-invalid')
    } else {
      el.classList.remove('is-invalid')
      this.props.handleZIPChange(value)
    }
  }
  render () {
    return (
      <input class='form-control form-control-lg text-center text-md-left' onInput={this.verify} maxLength='5' placeholder='Type in a ZIP code...' />
    )
  }
}


// Bootstrap row that displays a WeatherIcon and WeatherDetails.
class WeatherDisplay extends React.Component {
  render () {
    return (
      <div class='row'>
        <div class='col-md-3'>
          <WeatherIcon id={this.props.currentWeather.weather[0].icon} />
        </div>
        <div class='col-md-9'>
          <WeatherDetails data={this.props.currentWeather} />
        </div>
      </div>
    )
  }
}

// Simple helper component that renders an OpenWeatherMap weather status icon roughly fitted to the width of the element.
class WeatherIcon extends React.Component {
  render () {
    return (
      <img src={'https://openweathermap.org/img/w/' + this.props.id + '.png'} width='350' height='350' class='img-fluid mx-auto d-block' />
    )
  }
}

// List of weather details based on an OpenWeatherMap weather object.
class WeatherDetails extends React.Component {
  render () {
    // Helper object for our temperatures.
    let temp = {
      current: {
        k: this.props.data.main.temp,
        f: toFahrenheit(this.props.data.main.temp),
        c: toCelsius(this.props.data.main.temp)
      },
      high: {
        k: this.props.data.main.temp_max,
        f: toFahrenheit(this.props.data.main.temp_max),
        c: toCelsius(this.props.data.main.temp_max)
      },
      low: {
        k: this.props.data.main.temp_min,
        f: toFahrenheit(this.props.data.main.temp_min),
        c: toCelsius(this.props.data.main.temp_min)
      }
    }
    return (
      <div>
        <h4 class='text-center text-md-left'>{this.props.data.name}</h4>
        <h1 class='text-center text-md-left'>{this.props.data.weather[0].main}</h1>
        <h2 class='text-center text-md-left'>{temp.current.f}&deg;F <small class='font-weight-light'>{temp.current.c}&deg;C</small></h2>
        <h2 class='text-center text-md-left'>High {temp.high.f}&deg;F <small class='font-weight-light'>{temp.high.c}&deg;C</small></h2>
        <h2 class='text-center text-md-left'>Low {temp.low.f}&deg;F <small class='font-weight-light'>{temp.low.c}&deg;C</small></h2>
      </div>
    )
  }
}

// Bootstrap row that displays a header and multiple WeatherForecastCards.
class WeatherForecastList extends React.Component {
  render () {
    return (
      <div>
        <div class='row'>
          <div class='col p-3'>
            <h1 class='font-weight-light'>Forecast</h1>
          </div>
        </div>
        <div class='row'>
          <div class='col-md-3 my-3'>
            <WeatherForecastCard data={this.props.data[0]} />
          </div>
          <div class='col-md-3 my-3'>
            <WeatherForecastCard data={this.props.data[1]} />
          </div>
          <div class='col-md-3 my-3'>
            <WeatherForecastCard data={this.props.data[2]} />
          </div>
          <div class='col-md-3 my-3'>
            <WeatherForecastCard data={this.props.data[3]} />
          </div>
        </div>
      </div>
    )
  }
}

// Bootstrap card that takes an OpenWeatherMap weather object and displays key info from it.
class WeatherForecastCard extends React.Component {
  render () {
    // Helper object for our temperatures.
    let temp = {
      high: {
        f: toFahrenheit(this.props.data.main.temp_max),
        c: toCelsius(this.props.data.main.temp_max)
      },
      low: {
        f: toFahrenheit(this.props.data.main.temp_min),
        c: toCelsius(this.props.data.main.temp_min)
      }
    }
    let hour = new Date(this.props.data.dt * 1000).getHours()
    return (
      <div class='card'>
        <div class='card-header text-center'><h3 class='font-weight-light'>{hour}:00</h3></div>
        <div class='card-body'>
          <div class='text-center'>
            <WeatherIcon id={this.props.data.weather[0].icon} />
            <h4>{this.props.data.weather[0].main}</h4>
            <h4>{temp.low.f}&deg;F / {temp.high.f}&deg;F</h4>
            <h5 class='font-weight-light'>{temp.low.c}&deg;C / {temp.high.c}&deg;C</h5>
          </div>
        </div>
      </div>
    )
  }
}

// Bootstrap row with attribution information.
class WeatherFooter extends React.Component {
  render () {
    return (
      <div class='row'>
        <div class='col'>
          <p class='text-center'>App by Brian Lindner, 2018. Made with <a href='https://reactjs.org'>React</a> and <a href='https://getbootstrap.com'>Bootstrap</a>, and the <a href='https://openweathermap.org/'>OpenWeatherMap</a> API. </p>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <WeatherApp apiKey='' />,
  document.getElementById('react-container')
)
