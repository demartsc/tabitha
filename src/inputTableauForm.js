import React from 'react';
import propTypes from 'prop-types';
import Tableau from 'tableau-api';
import Speak from './Speak.js';

class InputTableau extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      speakText: this.props.speakText,
      viz: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.initTableau = this.initTableau.bind(this);
  }

  initTableau() {
    const vizURL = this.state.url;
    const options = {
      hideTabs: true,
      width: '700px',
      height: '800px',
      onFirstInteractive: () => {
        const wrkbk = viz.getWorkbook();
        const activeSheet = viz.getWorkbook().getActiveSheet();
        const sheets = activeSheet.getWorksheets();
        const name = wrkbk.getName();
        const objs = activeSheet.getObjects();
        const pubSheets = wrkbk.getPublishedSheetsInfo();
        console.log(objs);
        console.log(sheets);

        for (let i = 0; i < sheets.length; i++) {
          sheets[i].getFiltersAsync().then(f => {
            console.log(f);
          });
        }

        if (pubSheets.length == 1) {
          this.setState({
            speakText:
              'This workbook is named ' +
              name +
              ' and has ' +
              pubSheets.length.toString() +
              ' sheet published.'
          });
        } else {
          this.setState({
            speakText:
              'This workbook is named ' +
              name +
              ' and has ' +
              pubSheets.length.toString() +
              ' sheets published.'
          });
        }
        wrkbk.getParametersAsync().then(t => {
          this.setState({
            speakText:
              'It appears to have ' + t.length.toString() + ' parameters.'
          });
          // if the user has provided the description parameter this will read it back to the user, otherwise it will do nothing.
          for (let j = 0; j < t.length; j++) {
            if (t[j].getName().toUpperCase() == 'DESCRIPTION') {
              this.setState({
                speakText: 'The author has provided the following description. '
              });
              this.setState({
                speakText: t[j].getCurrentValue().formattedValue.toString()
              });
            }
          }
          console.log(t);
        });
      }
    };

    // cleanup if viz already exists
    // was trying to work with state, but state goes away between render and update submission by user
    if (this.state.viz) {
      let viz = this.state.viz;
      console.log(this.state.viz);
      console.log(this.viz);
      this.viz.dispose();
      this.viz = null;
    } else {
      console.log(this.state.viz);
    }

    /*  to remove, should be replaced by above
    console.log(viz);
    if (this.viz) {
      this.viz.dispose();
      this.viz = null;
    }
*/
    let viz = new Tableau.Viz(this.container, vizURL, options);
    this.setState({
      viz: viz
    });
  }

  handleInputChange(event) {
    this.state = { url: event.target.value };
  }

  handleButtonClick(event) {
    console.log('uncomment this call for testing');
    // currently this causes an error because state has been cleaned out at this point
    //this.initTableau(); // we are just using state, so don't need to pass anything
  }

  componentDidMount() {
    this.initTableau(); // we are just using state, so don't need to pass anything
  }

  render() {
    console.log(this.state);
    return (
      <div className="tabithaRootDiv">
        <input
          onChange={this.handleInputChange}
          placeholder="Input Tableau Public URL"
          name="vizInput"
          type="text"
          style={{ width: '70%' }}
        />
        <button onClick={this.handleButtonClick}>Submit to Tabitha</button>
        <br />
        <br />
        <div
          id="tableauViz"
          className="tableauContainer"
          ref={c => (this.container = c)}
          style={{ margin: '0 auto' }}
        />
        <Speak text={this.state.speakText} voice="UK English Female" />
      </div>
    );
  }
}

InputTableau.propTypes = {
  url: propTypes.string.isRequired,
  speakText: propTypes.string.isRequired
};

export default InputTableau;
