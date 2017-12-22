import React from 'react';
import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition';
import Tableau from 'tableau-api';

// source: https://www.npmjs.com/package/react-speech-recognition
class Dictaphone extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentWillMount() {
  //   this.props.abortListening(); // call this in will mount to turn of listening at first
  // }

  // componentDidMount() {
  //   //console.log('listener', this.props.listenUp);
  //   if (this.props.listenUp) {
  //     this.props.startListening();
  //   } else {
  //     this.props.abortListening();
  //   }
  // }

  componentWillUpdate(nextProps) {
    if (this.props.finalTranscript !== nextProps.finalTranscript) {
      console.log(
        'finalTranscript updated',
        nextProps.finalTranscript,
        nextProps.listenUp
      );

      if (nextProps.listenUp) {
        //split the words into array for easier analysis
        var words = nextProps.finalTranscript
          .toUpperCase()
          .replace(/[^\w\s]/gi, '')
          .split(' ');
        //console.log(words);
        if (words.length > 2) {
          // only call if we have at least three words
          this.props.onListen[0].func(words); // default to the first function for now...
        }
        this.props.resetTranscript();
      } else {
        this.props.resetTranscript();
      }
    }
  }

  render() {
    const {
      finalTranscript,
      browserSupportsSpeechRecognition,
      viz,
      listenUp,
      startListening,
      abortListening,
      interactive
    } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    return <div className="listenDiv" />;
  }
}

Dictaphone.propTypes = {
  // Props injected by SpeechRecognition
  listenUp: PropTypes.bool,
  viz: PropTypes.object,
  onListen: PropTypes.array
};

const options = {
  autoStart: true,
  listenUp: true
};

export default SpeechRecognition(options)(Dictaphone);
