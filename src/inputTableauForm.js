import React from 'react';
import propTypes from 'prop-types';
import Speak from './Speak.js';
import SpeechRecognition from './Listen.js';
import Tableau from 'tableau-api';
import _ from 'lodash';

class InputTableau extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      speakText:
        'Hi! I am Tabitha. Enter the URL for your visualization below. Then I will learn all about it.',
      voice: 'UK English Female',
      viz: null,
      vizActions: [],
      interactive: false,
      listenUp: false,
      button: 'start',
      description: false,
      resetDication: false
    };

    this.toggleButton = this.toggleButton.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.initTableau = this.initTableau.bind(this);
    this.firstInter = this.firstInter.bind(this);

    this.startTalking = this.startTalking.bind(this);
    this.doneTalking = this.doneTalking.bind(this);
    this.resetTranscript = this.resetTranscript.bind(this);

    this.tabithaActivate = this.tabithaActivate.bind(this);
    this.tabithaChange = this.tabithaChange.bind(this);
    this.tabithaSelect = this.tabithaSelect.bind(this);
    this.tabithaMove = this.tabithaMove.bind(this);

    this.tempURL = null;
    this.width = 800; // default, although this gets overwritten in the initTableau function
    this.height = 800; // default, although this gets overwritten in the initTableau function
    this.viz = null;
    this.vizActions = [];
    this.pubSheets = null;

    //send functions to listener
    this.listenFunctions = [
      { type: 'activate', func: this.tabithaActivate },
      { type: 'change', func: this.tabithaChange },
      { type: 'select', func: this.tabithaSelect },
      { type: 'switch', func: this.tabithaMove }
    ];

    this.parameters = {
      onstart: this.startTalking,
      onend: this.doneTalking
    };
  }

  firstInter() {
    //console.log('in Tableau', this.viz);
    const wrkbk = this.viz.getWorkbook();
    const activeSheet = this.viz.getWorkbook().getActiveSheet();
    const sheets = activeSheet.getWorksheets();
    const name = wrkbk.getName();
    const objs = activeSheet.getObjects();
    const filters = [];

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

    // get published sheets and save them for tableauContainer
    this.pubSheets = wrkbk.getPublishedSheetsInfo();
    this.vizActions = [];
    for (let v = 0; v < this.pubSheets.length; v++) {
      this.vizActions.push({
        caption: this.pubSheets[v].getName().replace(/[^\w\s]/gi, ''),
        name: this.pubSheets[v].getName().replace(/[^\w\s]/gi, ''),
        actName: this.pubSheets[v].getName(),
        type: 'tab',
        func: 'switch',
        values: []
      });
    }

    if (this.pubSheets.length === 1) {
      this.setState({
        speakText:
          'This workbook is named ' +
          name +
          ' and has ' +
          this.pubSheets.length.toString() +
          ' sheet published.'
      });
    } else {
      this.setState({
        speakText:
          'This workbook is named ' +
          name +
          ' and has ' +
          this.pubSheets.length.toString() +
          ' sheets published.'
      });
    }

    // we may not even need this as get objects will return the filters if they are visible.
    for (let i = 0; i < sheets.length; i++) {
      sheets[i].getFiltersAsync().then(f => {
        for (let j = 0; j < f.length; j++) {
          filters.push(f[j]); // this saves all filters (even duplicates across sheets) into an array
          this.vizActions.push({
            caption: f[j].$caption.replace(/[^\w\s]/gi, ''),
            name: f[j].getFieldName().replace(/[^\w\s]/gi, ''),
            actName: f[j].getFieldName(),
            type: 'filter',
            func: 'change',
            values: []
          });
        }
      });
    }

    wrkbk.getParametersAsync().then(t => {
      this.setState({
        speakText: 'It appears to have ' + t.length.toString() + ' parameters.'
      });
      // if the user has provided the description parameter this will read it back to the user, otherwise it will do nothing.
      for (let j = 0; j < t.length; j++) {
        this.vizActions.push({
          caption: t[j].getName().replace(/[^\w\s]/gi, ''),
          name: t[j].getName().replace(/[^\w\s]/gi, ''),
          actName: t[j].getName(),
          type: 'parameter',
          func: 'change',
          values: []
        });
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
            'Unfortunately, the author has not provided a description for us.'
        });
      }
      //use lodash to unique the array object list created (in case there are filters on multiple tabs)
      this.vizActions = _.uniqWith(this.vizActions, _.isEqual);
      this.setState({
        vizActions: this.vizActions,
        speakText: ''
      });
      //console.log(this.state.vizActions);
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
        this.setState({
          viz: this.viz,
          interactive: true,
          speakText: ''
        });
        //this.firstInter();
      }
    };

    //initiate the viz
    this.viz = new window.tableau.Viz(this.container, vizURL, options);
    // this.setState({
    //   viz: this.viz,
    //   speakText: ''
    // });

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

  resetTranscript() {
    this.setState({
      resetDication: true
    });
  }

  tabithaActivate(words) {
    // we only want to start doing something when the phrase tabitha is said
    console.log(words);
    let idxTabitha = _.indexOf(words, 'TABITHA');
    let idxFunc = -1; // probably a better way to do this
    let idxObj = -1; // probably a better way to do this
    let idxObjAdd = 0;
    if (idxTabitha >= 0) {
      // tabitha was said
      for (let k = 0; k < this.listenFunctions.length; k++) {
        if (
          words[idxTabitha + 1] === this.listenFunctions[k].type.toUpperCase()
        ) {
          // function was triggered
          idxFunc = k;
          break;
        }
      }
      if (idxFunc >= 0) {
        // we have a match on the function
        for (let l = 0; l < this.vizActions.length; l++) {
          if (
            this.listenFunctions[idxFunc].type.toUpperCase() ===
              this.vizActions[l].func.toUpperCase() &&
            (words[idxTabitha + 2] ===
              this.vizActions[l].caption.toUpperCase() ||
              words[idxTabitha + 2] === this.vizActions[l].name.toUpperCase())
          ) {
            idxObj = l;
            break;
          } else if (
            (this.listenFunctions[idxFunc].type.toUpperCase() ===
              this.vizActions[l].func.toUpperCase() &&
              (words[idxTabitha + 2] + words[idxTabitha + 3] ===
                this.vizActions[l].caption.toUpperCase().replace(' ', '') ||
                words[idxTabitha + 2] + words[idxTabitha + 3] ===
                  this.vizActions[l].name.toUpperCase().replace(' ', ''))) ||
            (words[idxTabitha + 3] ===
              this.vizActions[l].caption.toUpperCase() ||
              words[idxTabitha + 3] === this.vizActions[l].name.toUpperCase())
          ) {
            idxObj = l;
            idxObjAdd++;
            break;
          }
        }
        if (idxObj >= 0) {
          console.log('made it all the way');
          this.listenFunctions[idxFunc].func(
            this.vizActions[idxObj].actName,
            this.vizActions[idxObj].name,
            this.vizActions[idxObj].type,
            words,
            idxTabitha + 2 + idxObjAdd
          );
        } else {
          this.setState({
            speakText:
              "Sorry, I don't see any objects with the name " +
              words[idxTabitha + 2] +
              ' in this viz.'
          });
        }
      } else {
        let funcNames = '';
        for (let t = 0; t < this.listenFunctions.length; t++) {
          if (t === 0) {
            funcNames = this.listenFunctions[t].type;
          } else if (t === this.listenFunctions.length - 1) {
            funcNames = funcNames + ', or ' + this.listenFunctions[t].type;
          } else {
            funcNames = funcNames + ', ' + this.listenFunctions[t].type;
          }
        }
        this.setState({
          speakText:
            "I don't appear to have a command that matches that, try " +
            funcNames
        });
      }
    } else {
      this.setState({
        speakText:
          'If you want to get my attention make sure to start with my name... Tabitha'
      });
    }
  }

  tabithaMove(actNm, nm) {
    console.log('in tabitha move', nm);
    let wrkbk = this.state.viz.getWorkbook();
    wrkbk.activateSheetAsync(actNm).then(function(t) {
      console.log('sheet activated', t);
    });
    this.setState({
      speakText: 'Switching tabs to ' + nm + ' now'
    });
  }

  tabithaChange(actNm, nm, typ, words, idxObj) {
    console.log('in tabitha change', words, idxObj);
    let wrkbk = this.state.viz.getWorkbook();
    let sheet = wrkbk.getActiveSheet();
    let sheets = sheet.getWorksheets();

    //need to figure out how to grab the correct word / words...

    if (typ === 'parameter') {
      //if parameter then call change parameter
      console.log('changing paramter', nm, words[idxObj + 1]);
      wrkbk.changeParameterValueAsync(actNm, words[idxObj + 1]).then(
        function(p) {
          console.log('parameter changed', p);
        },
        function(err) {
          console.log(err);
        }
      );
      this.setState({
        speakText: 'Changing parameter ' + nm + ' to ' + words[idxObj + 1]
      });
    } else if (typ === 'filter') {
      //if filter then call filter on each sheet
      for (let y = 0; y < sheets.length; y++) {
        sheets[y].applyFilterAsync(actNm, words[idxObj + 1], 'REPLACE').then(
          function(f) {
            console.log('filter changed', f);
          },
          function(err) {
            console.log(err);
          }
        );
        this.setState({
          speakText: 'Changing filter ' + nm + ' to ' + words[idxObj + 1]
        });
      }
    }
  }

  tabithaSelect() {
    console.log('mark was asked');
    console.log(this.state.viz.getWorkbook().getActiveSheet());
    let sheets = this.state.viz
      .getWorkbook()
      .getActiveSheet()
      .getWorksheets();
    for (let y = 0; y < sheets.length; y++) {
      sheets[y].selectMarksAsync('Index', 100, 'REPLACE');
    }
    //this needs to be some code that will filter based on command
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
      interactive: false,
      speakText: 'Thanks! I am updating your workbook now.',
      description: false
    });
  }

  componentDidMount() {
    this.initTableau(); // we are just using state, so don't need to pass anything
  }

  // one problem is that we are changing state a lot we only want this to be called on viz update.
  componentDidUpdate(prevProps, prevState) {
    //console.log('updated');
    if (prevState.url !== this.state.url) {
      this.initTableau(); // we are just using state, so don't need to pass anything
    }

    if (this.state.viz && this.state.interactive && !prevState.interactive) {
      console.log('interactive flipped');
      this.firstInter();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    //console.log('will update', this.state, nextState); // error checking to remove

    //if we have a new viz we need to dispose of the existing one
    if (this.state.viz && nextState.url !== this.state.url) {
      this.state.viz.dispose();
    }
  }

  render() {
    //console.log(this.state);

    return (
      <div className="tabithaRootDiv">
        <button onClick={this.toggleButton}>{this.state.button}</button>
        <input
          onChange={this.handleInputChange}
          placeholder="Input Tableau Public URL"
          name="vizInput"
          type="text"
          style={{ width: '70%' }}
        />
        <button onClick={this.handleButtonClick}>Submit to Tabitha</button>
        <br />
        <SpeechRecognition
          autoStart
          continuous
          listenUp
          lang="en-IN"
          viz={this.state.viz}
          onListen={this.listenFunctions} //test this with filter first
          interactive={this.state.interactive}
        />
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
          interactive={this.state.interactive}
        />
      </div>
    );
  }
}

InputTableau.propTypes = {
  url: propTypes.string.isRequired
};

export default InputTableau;
