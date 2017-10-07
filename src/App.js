import React from 'react';
import logo from './logo.svg';
import './App.css';
import InputTableau from './inputTableauForm.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url:
        'https://public.tableau.com/views/TableauRosePetals/TableauRose?:embed=y&:display_count=yes',
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
        <InputTableau
          className="App-input"
          url={this.state.url}
          speakText={this.state.speakText}
        />
      </div>
    );
  }
}

export default App;
