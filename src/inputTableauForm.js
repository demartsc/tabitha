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
      speakText: '',
      voice: 'UK English Female',
      viz: null,
      vizActions: [],
      interactive: false,
      listenUp: true,
      button: 'listening',
      description: false,
      selectParm: null,
      exampleCount: 0
    };

    this.toggleButton = this.toggleButton.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.initTableau = this.initTableau.bind(this);
    this.firstInter = this.firstInter.bind(this);

    this.doneTalking = this.doneTalking.bind(this);

    this.tabithaActivate = this.tabithaActivate.bind(this);
    this.tabithaChange = this.tabithaChange.bind(this);
    this.tabithaSelect = this.tabithaSelect.bind(this);
    this.tabithaMove = this.tabithaMove.bind(this);
    this.tabithaRevert = this.tabithaRevert.bind(this);
    this.tabithaRefresh = this.tabithaRefresh.bind(this);
    this.tabithaExample = this.tabithaExample.bind(this);
    this.tabithaUndo = this.tabithaUndo.bind(this);
    this.tabithaRedo = this.tabithaRedo.bind(this);

    this.tempURL = null;
    this.width = 100; // default, although this gets overwritten in the initTableau function
    this.height = 100; // default, although this gets overwritten in the initTableau function
    this.viz = null;
    this.pubSheets = null;
    this.vizActions = [];
    this.vizActions.push({
      caption: 'EXAMPLE',
      name: 'EXAMPLE',
      actName: 'EXAMPLE',
      type: 'example',
      func: 'show',
      field: '',
      values: []
    });

    //send functions to listener
    this.listenFunctions = [
      { type: 'activate', func: this.tabithaActivate, parm: 'y' },
      { type: 'change', func: this.tabithaChange, parm: 'y' },
      { type: 'select', func: this.tabithaSelect, parm: 'y' },
      { type: 'switch', func: this.tabithaMove, parm: 'y' },
      { type: 'show', func: this.tabithaExample, parm: 'y' },
      { type: 'reset', func: this.tabithaRevert, parm: 'n' },
      { type: 'refresh', func: this.tabithaRefresh, parm: 'n' }
      //      { type: 'undo', func: this.tabithaUndo, parm: 'n' }, // not working for the time being, could be a JS API versioning or sheet vs wrkbk thing
      //      { type: 'redo', func: this.tabithaRedo, parm: 'n' }
    ];

    this.parameters = {
      onend: this.doneTalking
    };
  }

  firstInter() {
    const wrkbk = this.viz.getWorkbook();
    const activeSheet = this.viz.getWorkbook().getActiveSheet();
    const sheets = activeSheet.getWorksheets();
    const name = wrkbk.getName();
    const objs = activeSheet.getObjects();

    // need to check what happens with automatic sized workbooks...
    //console.log(activeSheet.getSize());
    if (activeSheet.getSize().maxSize) {
      this.width = activeSheet.getSize().maxSize.width;
      this.height = activeSheet.getSize().maxSize.height;
    } else {
      this.width = 600;
      this.height = 600;
    }

    // this will set the frame size the maximum allowed by the viz
    // need to vet whether this will be a problem with automatic vizzes however
    // see note herein for dashboards as well...
    // https://onlinehelp.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api_sample_resize.html
    this.viz.setFrameSize(this.width, this.height + 100);

    // get published sheets and save them for tableauContainer
    this.pubSheets = wrkbk.getPublishedSheetsInfo();
    this.vizActions = []; // clear out vizActions and then push example record
    this.vizActions.push({
      caption: 'EXAMPLE',
      name: 'EXAMPLE',
      actName: 'EXAMPLE',
      type: 'example',
      func: 'show',
      field: '',
      values: []
    });
    for (let v = 0; v < this.pubSheets.length; v++) {
      this.vizActions.push({
        caption: this.pubSheets[v].getName().replace(/[^\w\s]/gi, ''),
        name: this.pubSheets[v].getName().replace(/[^\w\s]/gi, ''),
        actName: this.pubSheets[v].getName(),
        type: 'tab',
        func: 'switch',
        field: '',
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
          ' sheet published.',
        listenUp: false,
        button: 'not listening'
      });
    } else {
      this.setState({
        speakText:
          'This workbook is named ' +
          name +
          ' and has ' +
          this.pubSheets.length.toString() +
          ' sheets published.',
        listenUp: false,
        button: 'not listening'
      });
    }

    // we may not even need this as get objects will return the filters if they are visible.
    for (let i = 0; i < sheets.length; i++) {
      // get filters and save objects for change command
      sheets[i].getFiltersAsync().then(f => {
        for (let j = 0; j < f.length; j++) {
          this.vizActions.push({
            caption: f[j].$caption.replace(/[^\w\s]/gi, ''),
            name: f[j].getFieldName().replace(/[^\w\s]/gi, ''),
            actName: f[j].getFieldName(),
            type: 'filter',
            func: 'change',
            field: '',
            values: []
          });
        }
      });
    }

    wrkbk.getParametersAsync().then(t => {
      if (t.legnth === 0) {
        this.setState({
          speakText: 'It appears to have no parameters.',
          listenUp: false,
          button: 'not listening'
        });
      } else if (t.length === 1) {
        this.setState({
          speakText:
            'It appears to have ' + t.length.toString() + ' parameter.',
          listenUp: false,
          button: 'not listening'
        });
      } else {
        this.setState({
          speakText:
            'It appears to have ' + t.length.toString() + ' parameters.',
          listenUp: false,
          button: 'not listening'
        });
      }
      // if the user has provided the description parameter this will read it back to the user, otherwise it will do nothing.
      for (let j = 0; j < t.length; j++) {
        this.vizActions.push({
          caption: t[j].getName().replace(/[^\w\s]/gi, ''),
          name: t[j].getName().replace(/[^\w\s]/gi, ''),
          actName: t[j].getName(),
          type: 'parameter',
          func: 'change',
          field: '',
          values: []
        });
        if (t[j].getName().toUpperCase() === 'DESCRIPTION') {
          this.setState({
            description: true,
            speakText: 'The author has provided the following description. ',
            listenUp: false,
            button: 'not listening'
          });
          this.setState({
            speakText: t[j].getCurrentValue().formattedValue.toString(),
            listenUp: false,
            button: 'not listening'
          });
          // this.setState({ // this may not be needed yet.
          //   listenUp: true
          // });
        }
        // if we have been provided a select configuration go get the info
        if (t[j].getName().toUpperCase() === 'SELECT CONFIGURATION') {
          this.setState({
            selectParm: t[j]
          });
        }
      }

      if (this.state.description === false) {
        this.setState({
          speakText:
            'Unfortunately, the author has not provided a description for us.',
          listenUp: false,
          button: 'not listening'
        });
      }

      if (this.state.selectParm) {
        let selectVals = [];
        let colIdx = -1;

        //for each value provided in config, get sheet and then data values, summary data only
        selectVals = this.state.selectParm.getAllowableValues();
        // get summary data and save values for select commands
        for (let v = 0; v < selectVals.length; v++) {
          sheets
            .get(selectVals[v].value)
            .getSummaryDataAsync()
            .then(d => {
              for (let c = 0; c < d.getColumns().length; c++) {
                if (
                  d.getColumns()[c].getFieldName() ===
                  selectVals[v].formattedValue
                ) {
                  colIdx = d.getColumns()[c].getIndex();
                  break;
                }
              }
              if (colIdx >= 0) {
                for (let c = 0; c < d.getData().length; c++) {
                  this.vizActions.push({
                    caption: d
                      .getData()
                      [c][colIdx].formattedValue.replace(/[^\w\s]/gi, ''),
                    name: d.getData()[c][colIdx].value.replace(/[^\w\s]/gi, ''),
                    actName: d.getData()[c][colIdx].value,
                    type: 'mark',
                    func: 'select',
                    field: d.getColumns()[colIdx].getFieldName(),
                    values: []
                  });
                }
              }
            });
        }
      }
      //use lodash to unique the array object list created (in case there are filters on multiple tabs, or repeated marks)
      this.vizActions = _.uniqWith(this.vizActions, _.isEqual);
      this.setState({
        vizActions: this.vizActions
      });
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
          interactive: true
        });
        //this.firstInter();
      }
    };

    //initiate the viz
    this.viz = new window.tableau.Viz(this.container, vizURL, options);
  }

  doneTalking() {
    // when we stop talking ... we start listening ... give it a cushion of a second
    //setTimeout(() => {
    if (this.state.button === 'not listening') {
      this.toggleButton();
    }
    console.log(
      'succesfully event listened for end of speech',
      this.state.listenUp
    );
    //}, 1000);
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
                this.vizActions[l].caption
                  .toUpperCase()
                  .replace(' ', '')
                  .replace(' ', '') ||
                words[idxTabitha + 2] + words[idxTabitha + 3] ===
                  this.vizActions[l].name
                    .toUpperCase()
                    .replace(' ', '')
                    .replace(' ', ''))) ||
            (words[idxTabitha + 3] ===
              this.vizActions[l].caption.toUpperCase() ||
              words[idxTabitha + 3] === this.vizActions[l].name.toUpperCase())
          ) {
            idxObj = l;
            idxObjAdd++;
            break;
          } else if (
            (this.listenFunctions[idxFunc].type.toUpperCase() ===
              this.vizActions[l].func.toUpperCase() &&
              (words[idxTabitha + 2] +
                words[idxTabitha + 3] +
                words[idxTabitha + 4] ===
                this.vizActions[l].caption
                  .toUpperCase()
                  .replace(' ', '')
                  .replace(' ', '') ||
                words[idxTabitha + 2] +
                  words[idxTabitha + 3] +
                  words[idxTabitha + 4] ===
                  this.vizActions[l].name
                    .toUpperCase()
                    .replace(' ', '')
                    .replace(' ', ''))) ||
            (words[idxTabitha + 4] ===
              this.vizActions[l].caption.toUpperCase() ||
              words[idxTabitha + 4] === this.vizActions[l].name.toUpperCase())
          ) {
            idxObj = l;
            idxObjAdd++;
            idxObjAdd++;
            break;
          }
        }
        if (idxObj >= 0) {
          this.listenFunctions[idxFunc].func(
            this.vizActions[idxObj].actName,
            this.vizActions[idxObj].name,
            this.vizActions[idxObj].type,
            this.vizActions[idxObj].field,
            words,
            idxTabitha + 2 + idxObjAdd
          );
        } else if (this.listenFunctions[idxFunc].parm.toUpperCase() === 'N') {
          this.listenFunctions[idxFunc].func(
            '',
            '',
            this.listenFunctions[idxFunc].type,
            '',
            words,
            -1
          );
        } else {
          this.setState({
            speakText:
              "Sorry, I don't see any objects with the name " +
              words[idxTabitha + 2] +
              ' in this viz.',
            listenUp: false,
            button: 'not listening'
          });
        }
      } else {
        let funcNames = '';
        for (let t = 1; t < this.listenFunctions.length; t++) {
          // starting at 1 to ignore the activate function
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
            funcNames,
          listenUp: false,
          button: 'not listening'
        });
      }
    } else {
      this.setState({
        speakText:
          'If you want to get my attention make sure to start with my name... Tabitha',
        listenUp: false,
        button: 'not listening'
      });
    }
  }

  tabithaMove(actNm, nm, typ, fld, words, idxObj) {
    console.log('in tabitha move', nm);
    let wrkbk = this.state.viz.getWorkbook();
    wrkbk.activateSheetAsync(actNm).then(function(t) {
      console.log('sheet activated', t);
    });
    this.setState({
      speakText: 'Switching tabs to ' + nm + ' now',
      listenUp: false,
      button: 'not listening'
    });
  }

  tabithaRevert(actNm, nm, typ, fld, words, idxObj) {
    console.log('in tabitha revert', nm);
    let viz = this.state.viz;
    viz.revertAllAsync().then(function(t) {
      console.log('viz reverted to starting state', t);
    });
    this.setState({
      speakText: 'Resetting the viz back to its beginning state.',
      listenUp: false,
      button: 'not listening'
    });
  }

  tabithaRefresh(actNm, nm, typ, fld, words, idxObj) {
    console.log('in tabitha refresh', nm);
    let viz = this.state.viz;
    viz.refreshDataAsync().then(function(t) {
      console.log('viz refresh with new data', t);
    });
    this.setState({
      speakText: 'Refreshing the data within the viz, if available.',
      listenUp: false,
      button: 'not listening'
    });
  }

  tabithaUndo(actNm, nm, typ, fld, words, idxObj) {
    console.log('in tabitha undo', nm);
    let viz = this.state.viz;
    viz.undoAsync().then(function(t) {
      console.log('viz undo completed', t);
    });
    this.setState({
      speakText: 'Sure, let me undo that.',
      listenUp: false,
      button: 'not listening'
    });
  }

  tabithaRedo(actNm, nm, typ, fld, words, idxObj) {
    console.log('in tabitha redo', nm);
    let viz = this.state.viz;
    viz.redoAsync().then(function(t) {
      console.log('viz redo completed', t);
    });
    this.setState({
      speakText: 'Sure, let me redo that.',
      listenUp: false,
      button: 'not listening'
    });
  }

  tabithaChange(actNm, nm, typ, fld, words, idxObj) {
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
        speakText: 'Changing parameter ' + nm + ' to ' + words[idxObj + 1],
        listenUp: false,
        button: 'not listening'
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
          speakText: 'Changing filter ' + nm + ' to ' + words[idxObj + 1],
          listenUp: false,
          button: 'not listening'
        });
      }
    }
  }

  tabithaSelect(actNm, nm, typ, fld, words, idxObj) {
    console.log('in tabitha select', nm, fld);
    let wrkbk = this.state.viz.getWorkbook();
    let sheets = wrkbk.getActiveSheet().getWorksheets();
    for (let y = 0; y < sheets.length; y++) {
      // loop through sheets to select mark
      sheets[y].selectMarksAsync(fld, actNm, 'REPLACE');
    }
    this.setState({
      speakText: 'Selecting ' + fld + ' ' + nm + ' now.',
      listenUp: false,
      button: 'not listening'
    });
  }

  tabithaExample(actNm, nm, typ, fld, words, idxObj) {
    console.log('in tabitha show', nm, fld);
    if (words[idxObj] === 'EXAMPLE') {
      if (this.state.exampleCount === 0) {
        this.setState({
          url:
            'https://public.tableau.com/views/StarWords/StarWords?:embed=y&:display_count=yes',
          interactive: false,
          speakText:
            'Sure, preparing my first example now. Try commands like Tabitha, select Yoda.',
          listenUp: false,
          button: 'not listening',
          exampleCount: this.state.exampleCount + 1
        });
      } else if (this.state.exampleCount === 1) {
        this.setState({
          url:
            'https://public.tableau.com/views/TomPettyFreeFallin/TomPettyDashboard?:embed=y&:display_count=yes',
          interactive: false,
          speakText:
            'Sure, preparing my second example now. Try commands like Tabitha, select electric guitar.',
          listenUp: false,
          button: 'not listening',
          exampleCount: this.state.exampleCount + 1
        });
      } else if (this.state.exampleCount === 2) {
        this.setState({
          url:
            'https://public.tableau.com/views/TableauRosePetals/TableauRose?:embed=y&:display_count=yes',
          interactive: false,
          speakText:
            'Sure, preparing my third example now. Try commands like Tabitha, change amplitude 15.',
          listenUp: false,
          button: 'not listening',
          exampleCount: this.state.exampleCount + 1
        });
      } else if (this.state.exampleCount === 3) {
        this.setState({
          url:
            'https://public.tableau.com/views/PolarClock_1/POLAR?:embed=y&:display_count=yes',
          interactive: false,
          speakText:
            'Sure, preparing my fourth example now. Try commands like Tabitha, refresh.',
          listenUp: false,
          button: 'not listening',
          exampleCount: this.state.exampleCount + 1
        });
      } else if (this.state.exampleCount > 3) {
        let tmp = this.state.exampleCount - 3;
        if (tmp === 1) {
          this.setState({
            speakText:
              'Sorry, I am all out of examples, for the ' + tmp + 'st time.',
            listenUp: false,
            button: 'not listening',
            exampleCount: this.state.exampleCount + 1
          });
        } else if (tmp === 2) {
          this.setState({
            speakText:
              'Sorry, I am all out of examples, for the ' + tmp + 'nd time.',
            listenUp: false,
            button: 'not listening',
            exampleCount: this.state.exampleCount + 1
          });
        } else if (tmp === 3) {
          this.setState({
            speakText:
              'Sorry, I am all out of examples, for the ' + tmp + 'rd time.',
            listenUp: false,
            button: 'not listening',
            exampleCount: this.state.exampleCount + 1
          });
        } else {
          this.setState({
            speakText:
              'Sorry, I am all out of examples, for the ' + tmp + 'th time.',
            listenUp: false,
            button: 'not listening',
            exampleCount: this.state.exampleCount + 1
          });
        }
      }
    } else {
      this.setState({
        speakText:
          'The show command only works for examples, try Tabitha, show example.',
        listenUp: false,
        button: 'not listening'
      });
    }
  }

  handleInputChange(event) {
    //this.setState({ url: event.target.value });
    this.tempURL = event.target.value;
  }

  toggleButton() {
    if (this.state.button === 'not listening') {
      this.setState({
        button: 'listening',
        listenUp: true
      });
    } else {
      this.setState({
        button: 'not listening',
        listenUp: false
      });
    }
  }

  handleButtonClick(event) {
    this.setState({
      url: this.tempURL,
      interactive: false,
      speakText: 'Thanks! I am updating your workbook now.',
      description: false,
      listenUp: false,
      button: 'not listening'
    });
  }

  componentDidMount() {
    setTimeout(() => {
      // set slight timeout to allow voices to load before we trigger intro
      this.setState({
        speakText:
          'Hi! I am Tabitha. Say... Tabitha, show example... or enter the URL for your visualization.',
        listenUp: false,
        button: 'not listening'
      });
    }, 250);
    this.initTableau(); // we are just using state, so don't need to pass anything
  }

  // one problem is that we are changing state a lot we only want this to be called on viz update.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.url !== this.state.url) {
      this.initTableau(); // we are just using state, so don't need to pass anything
    }

    if (this.state.viz && this.state.interactive && !prevState.interactive) {
      //console.log('interactive flipped');
      this.firstInter();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    //if we have a new viz we need to dispose of the existing one
    if (this.state.viz && nextState.url !== this.state.url) {
      this.state.viz.dispose();
    }
  }

  render() {
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
        <br />
        <div
          id="tableauViz"
          className="tableauContainer"
          ref={c => (this.container = c)}
          style={{
            margin: '0 auto',
            width: this.width,
            height: this.height + 50
          }}
        />
        <Speak
          text={this.state.speakText}
          voice={this.state.voice}
          parameters={this.parameters}
          interactive={this.state.interactive}
        />
        <SpeechRecognition
          autoStart
          continuous
          lang="en-US"
          //listenUp={this.state.listenUp ? startListening : abortListening}
          listenUp={this.state.listenUp}
          viz={this.state.viz}
          interactive={this.state.interactive}
          onListen={this.listenFunctions}
        />
        <br />
        <br />
      </div>
    );
  }
}

InputTableau.propTypes = {
  url: propTypes.string.isRequired
};

export default InputTableau;
