
import React, { Component } from 'react';
import { Button, Dropdown, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import './App.css';


const searchOptions = [
  {
    key: 'City',
    text: 'City',
    value: 'City'
  },
  {
    key: 'Lat/Long',
    text: 'Lat/Long',
    value: 'Lat/Long'
  },
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      cityChosen: false,
      zipChosen: false,
      showNameInput: false,
      showLatLongInput: false,
      items: [],
      latitude: '',
      longitude: '',
    };
    this.getMyLocation = this.getMyLocation.bind(this);
  }

  componentDidMount() {
    //get user's location and show them weather when they load the app:
    this.getMyLocation();
  }

  //getMyLocation gets the user's lat/long coordinates
  getMyLocation() {
    const location = window.navigator && window.navigator.geolocation
    
    if (location) {
      location.getCurrentPosition((position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.getWeatherLatLong(position.coords.latitude, position.coords.longitude);
      }, (error) => {
        this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
      })
    }
  }

  //getWeatherLatLong makes API call with user's lat/long
  getWeatherLatLong(lat, long){
    const APIKEY = '18aaef05aea27a3ddbb3d40975b82b7a';
    let apiUrl = "http://api.openweathermap.org/data/2.5/weather?lat=";

    fetch(apiUrl + lat + "&lon=" + long + "&APPID=" + APIKEY + "&units=imperial")
      .then(res => res.json())
      .then(
        (json) => {
          console.log('json', json);
          this.setState({
            isLoaded: true,
            coord: json.coord,
            temp: json.main.temp,
            pressure: json.main.pressure,
            humidity: json.main.humidity,
            tempData: [{name: 'right now', temperature: json.main.temp}],
            humidityData: [{name: 'right now', humidity: json.main.humidity}],
            presureData: [{name: 'right now', pressure: json.main.pressure}],
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  //getWeatherByCityName makes API call with user's City name
  getWeatherByCityName(cityName){
    const APIKEY = '18aaef05aea27a3ddbb3d40975b82b7a';
    let apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=";

    fetch(apiUrl + cityName + "&APPID=" + APIKEY + "&units=imperial")
      .then(res => res.json())
      .then(
        (json) => {
          console.log('json', json);
          this.setState({
            isLoaded: true,
            coord: json.coord,
            temp: json.main.temp,
            pressure: json.main.pressure,
            humidity: json.main.humidity,
            tempData: [{name: 'right now', temperature: json.main.temp}],
            humidityData: [{name: 'right now', humidity: json.main.humidity}],
            presureData: [{name: 'right now', pressure: json.main.pressure}],
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleInput(event: Object, data) {
    this.setState({ [data.name]: data.value });
  }

  handleCityOrLatLong = (e, { value }) => 
    this.setState({ dropdownSelection: value });

  handleCityName = (e, { value }) => 
    this.setState({ cityName: value });

  handleLat = (e, { value }) => 
    this.setState({ latChosen: value });

  handleLong = (e, { value }) => 
    this.setState({ longChosen: value });

  handleButtonClick(dropdownSelection){
    //const {dropdownSelection} = this.state;
/*
    console.log('values so far:');
    console.log('you chose', dropdownSelection);
    console.log('longChosen', this.state.longChosen);
    console.log('latChosen', this.state.latChosen);
    console.log('this.state.cityname', this.state.cityName);*/
    if(dropdownSelection === 'City'){
      this.getWeatherByCityName(this.state.cityName);
    }else{
      this.getWeatherLatLong(this.state.latChosen, this.state.longChosen);
    }
  }

  render() {
    const { 
      latitude,
      latInput,
      longitude,
      longInput,
      temp,
      pressure,
      humidity,
      dropdownSelection,
      locationInput
    } = this.state;
    
    return (
      <div className="App">
        <div className="title">Weather app</div>
        <br />
        <div className="subHeader">Search by</div>
        <br />
        <Dropdown
          placeholder='City or Lat/Long'
          fluid
          selection
          options={searchOptions}
          className='dropdown-name'
          onChange={this.handleCityOrLatLong}
          value={dropdownSelection}
        />
        <br />
        <div className="subHeader">Search for your location</div>
        <br /><br />

        {this.state.dropdownSelection === 'City' && (
          <Input focus placeholder='Enter city' type="text" value={locationInput} onChange={this.handleCityName}/>
        )}

        {this.state.dropdownSelection === 'Lat/Long' && (
          <div>
            <Input focus placeholder='Enter latitude' type="text" value={latInput} onChange={this.handleLat}/>
            <br /><br />
            <Input focus placeholder='Enter longitude' type="text" value={longInput} onChange={this.handleLong}/>
          </div>
        )}

        <br />

        <Button 
          className='button'
          onClick={this.handleButtonClick.bind(this, dropdownSelection)}
        >Lets go!</Button>

        <br />

        <div className="subHeaderResults">At Your Location:</div>
        <br />

        <div>Lat: {latitude}</div>
        <div>Long: {longitude}</div>
        <div>Temp: {temp}</div>
        <div>Pressure: {pressure}</div>
        <div>Humidity: {humidity}</div>

        <div className="subHeaderResults">At Selected Location:</div>
        <br />
        {this.state.tempData && (
          <div>
            <div className="subHeader">Temperature results:</div>
            <LineChart width={250} height={200} data={this.state.tempData}>
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <YAxis />
              <Legend />
            </LineChart>
          </div>
        )}

        {this.state.humidityData && (
          <div>
            <div className="subHeader">Humidity results:</div>
            <LineChart width={250} height={200} data={this.state.humidityData}>
              <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <YAxis />
              <Legend />
            </LineChart>
          </div>
        )}

        {this.state.presureData && (
          <div>
            <div className="subHeader">Pressure results:</div>
            <LineChart width={250} height={200} data={this.state.presureData}>
              <Line type="monotone" dataKey="pressure" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <YAxis />
              <Legend />
            </LineChart>
          </div>
        )}
      </div>
    )
  }
}

export default App;