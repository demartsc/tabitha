import React, { Component, PropTypes } from 'react';
import logo from './logo.svg';
import './App.css';
import Speak from './Speak.js';
import InputTableau from './inputTableauForm.js';
import tableau from 'tableau-api';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url:
        'https://public.tableau.com/views/PhaseoftheMoon/MoonPhase?:embed=y&:display_count=yes',
      speakText:
        'Hi! I am Tabitha. Enter the URL for your visualization below. Then I will learn all about it.',
      paramNames: [],
      paramData: {},
      isLoading: true
    };
  }

  render() {
    //console.log (this);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Tabitha: Powered by React + JS + Tableau</h2>
        </div>
        <br />
        <InputTableau className="App-input" url={this.state.url} />
        <Speak text={this.state.speakText} voice="UK English Female" />
      </div>
    );
    //const wrkbk = this.viz.getWorkbook().getActiveSheet().getWorksheets()[0];
    console.log('wrkbk');
  }
}

export default App;
