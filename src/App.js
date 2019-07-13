
import React, { Component } from 'react';
import { Button, Dropdown, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import logo from './logo.svg';
import './App.css';


const searchOptions = [
  {
    key: 'City',
    text: 'City',
    value: 'City'
  },
  {
    key: 'Zip',
    text: 'Zip',
    value: 'Zip'
  },
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      latitude: '',
      longitude: '',
    };
    this.getMyLocation = this.getMyLocation.bind(this);
  }

  componentDidMount() {
    this.getMyLocation();

    
    /*fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
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
      )*/
  }

  getWeatherLatLong(lat, long){
    const APIKEY =  '18aaef05aea27a3ddbb3d40975b82b7a';
    console.log('get getWeatherLatLong called iwth lat', lat);
    //fetch("api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long)
    fetch("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=18aaef05aea27a3ddbb3d40975b82b7a&units=imperial")
      .then(res => res.json())
      .then(
        (json) => {
          console.log('json', json);
          this.setState({
            isLoaded: true,
            coord: json.coord,
            temp: json.main.temp,
            pressure: json.main.pressure,
            humidity: json.main.humidity
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

  getMyLocation() {
    const location = window.navigator && window.navigator.geolocation
    
    if (location) {
      console.log('locationnn', location);
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

  render() {
    const { latitude, longitude, temp, pressure, humidity } = this.state;
    
    return (
      <div className="App">
        <div className="title">Weather app</div>
        <br />
        <div className="subHeader">Search by</div>
        <br />
        <Dropdown
          placeholder='City or zip'
          fluid
          selection
          options={searchOptions}
          className='dropdown-name'
        />
        <br />
        <div className="subHeader">Search for your location</div>
        <br /><br />
        <Input focus placeholder='Enter city or zip' />
        <br />
        <Button className='button'>Lets go!</Button>
        <br />
        <input type="text" value={latitude} />
        <input type="text" value={longitude} />
        <div>temp: {temp}</div>
        <div>pressure: {pressure}</div>
        <div>humidity: {humidity}</div>
      </div>
    )
/*    
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
        <div className="App">Data has been loaded</div>
          <ul>
            {items.map(item => (
              <li key={item.name}>
                {item.name} {item.price}
              </li>
            ))}
          </ul>
        </div>
      );
    }*/
  }
}

export default App;