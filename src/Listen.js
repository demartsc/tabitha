import React from 'react';
import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition';
import Tableau from 'tableau-api';

// source: https://www.npmjs.com/package/react-speech-recognition
class Dictaphone extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.finalTranscript != nextProps.finalTranscript) {
      console.log('finalTranscript updated', nextProps.finalTranscript);

      //split the words into array for easier analysis
      var words = nextProps.finalTranscript.split(' ');
      console.log(words);

      //now check if any words match our function array
      for (let w = 0; w < words.length; w++) {
        if (words[w] in this.props.onListen) {
          console.log(
            'we found ' + words[w] + ':',
            this.props.onListen[words[w]]
          );
          this.props.onListen[words[w]]();
        }
      }
    }
  }

  render() {
    const {
      transcript,
      interimTranscript,
      finalTranscript,
      resetTranscript,
      browserSupportsSpeechRecognition,
      viz,
      listenUp,
      onListen,
      interactive,
      resetDication
    } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    //this does not work yet
    if (resetDication) {
      console.log('resetting');
      resetTranscript();
    }

    if (!listenUp) {
      return null;
    } else {
      console.log(this.props);
      if (viz && interactive) {
        console.log(viz);
        //console.log(viz.getWorkbook().changeParameterValueAsync('K', 10));
        //console.log(viz.getWorkbook().changeParameterValueAsync('Point Density', 500));
      }

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
