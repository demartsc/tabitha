import React, { Component, PropTypes } from 'react';
import logo from './logo.svg';
import './App.css';
import centerComponent from 'react-center-component';
import InputTableau from './inputTableauForm.js'

class App extends Component {
  render() {
    //console.log (this);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Tabitha</h2>
        </div>
        <br />
        <InputTableau className="App-input" url='https://public.tableau.com/views/PhaseoftheMoon/MoonPhase?:embed=y&:display_count=yes' />
      </div>
    );
  }
}

export default App;
