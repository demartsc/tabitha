import React from 'react';
import logo from './logo.svg';
import tabIcon from './tableau.gif';
import './App.css';
import InputTableau from './inputTableauForm.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
      //'https://public.tableau.com/views/StarWords/StarWords?:embed=y&:display_count=yes&publish=yes',
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
          <a href="https://twitter.com/demartsc?lang=en">Chris DeMartini</a>,
          see{' '}
          <a href="https://twitter.com/demartsc?lang=en">
            detailed write up
          </a>{' '}
          and thanks to those that let me use their vizzes!
        </p>
        <p>
          Inspired by{' '}
          <a href="https://www.dataplusscience.com/Tabitha.html">
            Original Tabitha Post
          </a>{' '}
          by Jeffrey Shaffer{' '}
        </p>
        <div>
          <a href="https://responsivevoice.org">
            ResponsiveVoice-NonCommercial
          </a>{' '}
          licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
            <img
              title="ResponsiveVoice Text To Speech"
              src="https://responsivevoice.org/wp-content/uploads/2014/08/95x15.png"
              alt="95x15"
              width="95"
              height="15"
            />
          </a>
        </div>
      </div>
    );
  }
}

export default App;
