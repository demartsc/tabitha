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

  componentWillMount() {}

  render() {
    console.log('listen.js', this.props);
    const {
      transcript,
      interimTranscript,
      finalTranscript,
      resetTranscript,
      browserSupportsSpeechRecognition,
      viz,
      listenUp
    } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    if (!listenUp) {
      return null;
    } else {
      console.log(this.props);
      if (viz) {
        console.log(viz);
        console.log(viz.getWorkbook().changeParameterValueAsync('K', 10));
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
  viz: PropTypes.object
};

const options = {
  autoStart: false
};

export default SpeechRecognition(options)(Dictaphone);
