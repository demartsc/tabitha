import React, { Component, PropTypes } from 'react';
import Speak from './Speak.js';
import logo from './logo.svg';
import './App.css';
import centerComponent from 'react-center-component';
import InputTableau from './inputTableauForm.js';

class App extends Component {
  render() {
    //console.log (this);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Tabitha: Powered by React + JS + Tableau</h2>
        </div>
        <br />
        <InputTableau
          className="App-input"
          url="https://public.tableau.com/views/PhaseoftheMoon/MoonPhase?:embed=y&:display_count=yes"
        />
        <Speak
          text="Hi! I am Tabitha. Enter the URL for your visualization below. Then I will learn all about it."
          voice="UK English Female"
        />
      </div>
    );
  }
}

export default App;
