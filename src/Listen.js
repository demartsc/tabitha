import React from 'react';
import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition';
import Tableau from 'tableau-api';

// source: https://www.npmjs.com/package/react-speech-recognition
class Dictaphone extends React.Component {
  initTableau(viz) {
    const wrkbk = viz.getWorkbook();
    const activeSheet = wrkbk.getActiveSheet();
    const sheets = activeSheet.getWorksheets();
    const name = wrkbk.getName();
    const objs = activeSheet.getObjects();
    const pubSheets = wrkbk.getPublishedSheetsInfo();

    console.log('dictation workbook', wrkbk);
  }

  parseFuncs() {
    for (let i = 0; i < this.props.onListen.length; i++) {
      console.log(this.props.onListen[i]);
      // in here we can call each function that has been sent with final transcript
    }
  }

  render() {
    console.log('listen.js', this.props);
    const {
      transcript,
      interimTranscript,
      finalTranscript,
      resetTranscript,
      browserSupportsSpeechRecognition,
      viz,
      listenUp,
      onListen,
      interactive
    } = this.props;

    //split the words into array for easier analysis
    var words = finalTranscript.split(' ');
    console.log(words);

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    if (!listenUp) {
      return null;
    } else {
      console.log(this.props);
      if (viz && interactive) {
        console.log(viz);
        console.log(viz.getWorkbook().changeParameterValueAsync('K', 10));
        console.log(
          viz.getWorkbook().changeParameterValueAsync('Point Density', 500)
        );
      }
      //this.initTableau(viz).bind(this);

      return (
        <div>
          <span>{finalTranscript}</span>
        </div>
      );
    }
  }
}

Dictaphone.propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
  listenUp: PropTypes.bool,
  viz: PropTypes.object,
  onListen: PropTypes.object
};

const options = {
  autoStart: true,
  listenUp: false
};

export default SpeechRecognition(options)(Dictaphone);
