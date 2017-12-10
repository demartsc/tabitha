import React from 'react';
import propTypes from 'prop-types';
import Speak from './Speak.js';
import Dictaphone from './Listen.js';
import Tableau from 'tableau-api';
import { uniqBy } from 'lodash'; // may not need this as sheets are different or filters are not duplicated

class InputTableau extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      speakText: this.props.speakText,
      voice: 'UK English Female',
      viz: null,
      listenUp: false,
      button: 'start',
      description: false
    };

    this.toggleButton = this.toggleButton.bind(this);
    this.startTalking = this.startTalking.bind(this);
    this.doneTalking = this.doneTalking.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.initTableau = this.initTableau.bind(this);
    this.firstInter = this.firstInter.bind(this);
    this.tempURL = null;
    this.width = 800; // default, although this gets overwritten in the initTableau function
    this.height = 800; // default, although this gets overwritten in the initTableau function
    this.viz = null;

    this.parameters = {
      onstart: this.startTalking,
      onend: this.doneTalking
    };
  }

  firstInter() {
    console.log('in Tableau', this.viz);
    const wrkbk = this.viz.getWorkbook();
    const activeSheet = this.viz.getWorkbook().getActiveSheet();
    const sheets = activeSheet.getWorksheets();
    const name = wrkbk.getName();
    const objs = activeSheet.getObjects();
    const pubSheets = wrkbk.getPublishedSheetsInfo();
    //console.log(objs);
    const filters = [];
    //console.log(sheets);

    // need to check what happens with automatic sized workbooks...
    //console.log(activeSheet.getSize());
    if (activeSheet.getSize().maxSize) {
      this.width = activeSheet.getSize().maxSize.width;
      this.height = activeSheet.getSize().maxSize.height;
    } else {
      this.width = 800;
      this.height = 800;
    }

    // this will set the frame size the maximum allowed by the viz
    // need to vet whether this will be a problem with automatic vizzes however
    // see note herein for dashboards as well...
    // https://onlinehelp.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api_sample_resize.html
    this.viz.setFrameSize(this.width, this.height + 100);

    // we may not even need this as get objects will return the filters if they are visible.
    for (let i = 0; i < sheets.length; i++) {
      sheets[i].getFiltersAsync().then(f => {
        for (let j = 0; j < f.length; j++) {
          filters.push(f[j]); // this saves all filters (even duplicates across sheets) into an array
          //console.log(filters);
        }
        //this doesn't work, but the idea here is to unique the filter array
        //uniqBy(filters, function(elem) { return [elem.fieldRole, elem.caption, elem.dataSourceName, elem.field, elem.type].join(); });
        //console.log(filters);
      });
    }

    if (pubSheets.length === 1) {
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
        speakText: 'It appears to have ' + t.length.toString() + ' parameters.'
      });
      // if the user has provided the description parameter this will read it back to the user, otherwise it will do nothing.
      for (let j = 0; j < t.length; j++) {
        if (t[j].getName().toUpperCase() === 'DESCRIPTION') {
          this.setState({
            description: true,
            speakText: 'The author has provided the following description. '
          });
          this.setState({
            speakText: t[j].getCurrentValue().formattedValue.toString()
          });
          this.setState({
            speakText: '',
            listenUp: true
          });
        }
      }
      if (this.state.description === false) {
        this.setState({
          speakText:
            'Unfortunately, the author has not provided a description for us. '
        });
      }
      //console.log(t);
    });
  }

  initTableau() {
    const vizURL = this.state.url;
    const options = {
      hideTabs: true,
      width: this.width,
      height: this.height,
      onFirstInteractive: () => {
        console.log('made it');
        this.firstInter();
      }
    };

    //initiate the viz
    this.viz = new window.tableau.Viz(this.container, vizURL, options);
    this.setState({
      viz: this.viz,
      speakText: ''
    });

    //if changing viz need to wipe out speakText - can possibly remove
    // if (this.state.speakText === 'Thanks! I am updating your workbook now.') {
    //   this.setState({
    //     viz: this.viz,
    //     speakText: ''
    //   });
    // } else {
    //   this.setState({
    //     viz: this.viz
    //   });
    // }
  }

  startTalking() {
    console.log('succesfully event listened for start of speech');
  }
  doneTalking() {
    console.log('succesfully event listened for end of speech');
  }

  handleInputChange(event) {
    //this.setState({ url: event.target.value });
    this.tempURL = event.target.value;
  }

  toggleButton() {
    if (this.state.button === 'start') {
      this.setState({
        button: 'stop',
        listenUp: true
      });
    } else {
      this.setState({
        button: 'start',
        listenUp: false
      });
    }
  }

  handleButtonClick(event) {
    this.setState({
      url: this.tempURL,
      speakText: 'Thanks! I am updating your workbook now.',
      description: false
    });
  }

  componentDidMount() {
    this.initTableau(); // we are just using state, so don't need to pass anything
  }

  // one problem is that we are changing state a lot we only want this to be called on viz update.
  componentDidUpdate(prevProps, prevState) {
    console.log('updated');
    if (prevState.url !== this.state.url) {
      this.initTableau(); // we are just using state, so don't need to pass anything
    }
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('will update');

    //if we have a new viz we need to dispose of the existing one
    if (this.state.viz && nextState.url !== this.state.url) {
      this.state.viz.dispose();
    }
  }

  render() {
    console.log(this.state);

    return (
      <div className="tabithaRootDiv">
        <button onClick={this.toggleButton}>{this.state.button}</button>
        <button onClick={this.resetTranscript}>Reset Dictation</button>
        <input
          onChange={this.handleInputChange}
          placeholder="Input Tableau Public URL"
          name="vizInput"
          type="text"
          style={{ width: '70%' }}
        />
        <button onClick={this.handleButtonClick}>Submit to Tabitha</button>
        <br />
        <Dictaphone autoStart continuous lang="en-IN" viz={this.state.viz} />
        <br />
        <div
          id="tableauViz"
          className="tableauContainer"
          ref={c => (this.container = c)}
          style={{ margin: '0 auto' }}
        />
        <Speak
          text={this.state.speakText}
          voice={this.state.voice}
          parameters={this.parameters}
        />
      </div>
    );
  }
}

InputTableau.propTypes = {
  url: propTypes.string.isRequired,
  speakText: propTypes.string.isRequired
};

export default InputTableau;
