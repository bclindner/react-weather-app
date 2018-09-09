// Example data.
const example = {
    "dt": 0,
    "weather": [
        {
            "main": "...",
            "description": "...",
            "icon": "01d"
        }
    ],
    "main": {
        "temp": 0,
        "temp_min": 0,
        "temp_max": 0
    },
    "name": "...",
}

// Converts Kelvin to Celsius.
function toCelsius (temp) {
  return (temp - 273.15).toFixed(1)
}
// Converts Kelvin to Fahrenheit.
function toFahrenheit (temp) {
  return ((temp - 273.15) * (9 / 5) + 32).toFixed(1)
}

const apiKey = "deadbeefdeadbeefdeadbeefdeadbeef"

class WeatherApp extends React.Component {
  constructor(props) {
    super(props)
    this.apiKey = apiKey
    this.state = {
      zip: 30458,
      currentWeather: example,
      forecast: [example, example, example, example]
    }
    this.handleZIPChange = this.handleZIPChange.bind(this)
  }
  update () {
    fetch('https://api.openweathermap.org/data/2.5/weather?appid=' + this.apiKey + '&zip=' + this.state.zip)
      .then(res => res.json())
      .then(json => this.setState({currentWeather: json}))
    fetch('https://api.openweathermap.org/data/2.5/forecast?appid=' + this.apiKey + '&zip=' + this.state.zip)
      .then(res => res.json())
      .then(json => this.setState({forecast: json.list}))
  }
  handleZIPChange(newZip) {
    this.setState({
      zip: newZip
    }, this.update)
  }
  componentDidMount() {
    this.update()
  }
  render () {
    return (
      <div class="container border shadow my-sm-3 p-3">
        <header class="row">
          <div class="col-md-3">
            <h1 class="text-center text-md-left font-weight-light">Weather</h1>
          </div>
          <div class="col-md-9">
            <WeatherSearchBar handleZIPChange={this.handleZIPChange}/>
          </div>
        </header>
        <hr />
        <div class="row">
          <div class="col-md-3">
            <WeatherIcon id={this.state.currentWeather.weather[0].icon} />
          </div>
          <div class="col-md-9">
            <WeatherDetails data={this.state.currentWeather} />
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col p-3">
            <h1 class="font-weight-light">Forecast</h1>
          </div>
        </div>
        <WeatherForecastList data={this.state.forecast}/>
        <hr/>
        <div class="row">
          <div class="col">
            <p class="text-center">App by Brian Lindner, 2018</p>
          </div>
        </div>
      </div>
    )
  }
}

class WeatherSearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.verify = this.verify.bind(this)
  }
  verify(event) {
    let el = event.target
    let value = el.value
    if (value.length != 5){
      el.classList.add('is-invalid')
    } else {
      el.classList.remove('is-invalid')
      this.props.handleZIPChange(value)
    }
  }
  render () {
    return (
      <input class="form-control form-control-lg text-center text-md-left" onInput={this.verify} maxLength="5" placeholder="Type in a ZIP code..." />
    )
  }
}

class WeatherDetails extends React.Component {
  render () {
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
      <div class="col-md-9">
        <h4 class="text-center text-md-left">{this.props.data.name}</h4>
        <h1 class="text-center text-md-left">{this.props.data.weather[0].main}</h1>
        <h2 class="text-center text-md-left">{temp.current.f}&deg;F <small class="font-weight-light">{temp.current.c}&deg;C</small></h2>
        <h2 class="text-center text-md-left">High {temp.high.f}&deg;F <small class="font-weight-light">{temp.high.c}&deg;C</small></h2>
        <h2 class="text-center text-md-left">Low {temp.low.f}&deg;F <small class="font-weight-light">{temp.low.c}&deg;C</small></h2>
      </div>
    )
  }
}

class WeatherIcon extends React.Component {
  render () {
    return (
      <div >
        <img src={'https://openweathermap.org/img/w/' + this.props.id + '.png'} width="350" height="350" class="img-fluid mx-auto d-block" />
      </div>
    )
  }
}

class WeatherForecastList extends React.Component {
  render() {
    return (
      <div class="row">
        <div class="col-md-3 my-3">
          <WeatherForecastCard data={this.props.data[0]} />
        </div>
        <div class="col-md-3 my-3">
          <WeatherForecastCard data={this.props.data[1]} />
        </div>
        <div class="col-md-3 my-3">
          <WeatherForecastCard data={this.props.data[2]} />
        </div>
        <div class="col-md-3 my-3">
          <WeatherForecastCard data={this.props.data[3]} />
        </div>
      </div>
    )
  }
}

class WeatherForecastCard extends React.Component {
  render() {
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
      <div class="card">
        <div class="card-header text-center"><h3 class="font-weight-light">{hour}:00</h3></div>
        <div class="card-body">
          <div class="text-center">
            <WeatherIcon id={this.props.data.weather[0].icon}/>
            <h4>{this.props.data.weather[0].main}</h4>
            <h4>{temp.low.f}&deg;F / {temp.high.f}&deg;F</h4>
            <h5 class="font-weight-light">{temp.low.c}&deg;C / {temp.high.c}&deg;C</h5>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <WeatherApp />,
  document.getElementById('react-container')
)
