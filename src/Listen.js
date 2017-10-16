import React from 'react';
import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition';

// source: https://www.npmjs.com/package/react-speech-recognition
class Dictaphone extends React.Component {
  render() {
    const {
      transcript,
      interimTranscript,
      finalTranscript,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = this.props;

    console.log(this.props);

    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    return (
      <div>
        <span>{finalTranscript}</span>
      </div>
    );
  }
}

Dictaphone.propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

export default SpeechRecognition(Dictaphone);
