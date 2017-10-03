import React from 'react';
import propTypes from 'prop-types';
import Tableau from 'tableau-api';
import Speak from './Speak.js';

class InputTableau extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      speakText: this.props.speakText
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  initTableau(vizURL) {
    const options = {
      hideTabs: true,
      width: '700px',
      height: '800px',
      onFirstInteractive: () => {
        const wrkbk = viz.getWorkbook();
        const activeSheet = viz.getWorkbook().getActiveSheet();
        const name = wrkbk.getName();
        const pubSheets = wrkbk.getPublishedSheetsInfo();
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
          console.log(t);
        });
      }
    };

    // cleanup
    if (this.viz) {
      this.viz.dispose();
      this.viz = null;
    }

    let viz = new Tableau.Viz(this.container, vizURL, options);
  }

  handleInputChange(event) {
    this.state = { url: event.target.value };
  }

  handleButtonClick(event) {
    let tempURL = this.state.url;
    this.setState({ url: tempURL });
    //this.initTableau(this.state.url); // this causes an error at the moment.
  }

  componentDidMount() {
    this.initTableau(this.state.url);
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
        <div ref={c => (this.container = c)} style={{ margin: '0 auto' }} />
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
