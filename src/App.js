import React from 'react';
import logo from './logo.svg';
import tabIcon from './tableau.gif';
import './App.css';
import InputTableau from './inputTableauForm.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url:
        'https://public.tableau.com/views/TableauRosePetals/TableauRose?:embed=y&:display_count=yes',
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
          <img src={tabIcon} className="App-logo" alt="logo" />
          <h2>Tabitha: Powered by React + JS + Tableau</h2>
        </div>
        <br />
        <InputTableau className="App-input" url={this.state.url} />
        <br />
        <p>
          {' '}
          Created by{' '}
          <a href="https://twitter.com/demartsc?lang=en">
            Chris DeMartini
          </a>, <a href="https://twitter.com/highvizability">
            Jeffrey Shaffer
          </a>{' '}
          and{' '}
          <a href="https://twitter.com/sock1ttoomey?lang=en">
            Chris Toomey
          </a>{' '}
        </p>
        <p>
          {' '}
          <a href="https://www.dataplusscience.com/Tabitha.html">
            Original Tabitha Post
          </a>{' '}
          by Jeffrey Shaffer{' '}
        </p>
        <p>
          {' '}
          Need to add the attribution to responsive voice non-commercial license
          here{' '}
        </p>
      </div>
    );
  }
}

export default App;
