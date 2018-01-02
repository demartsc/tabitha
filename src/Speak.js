import React from 'react';
import PropTypes from 'prop-types';
import responsiveVoice from 'responsivevoice';

class Speak extends React.Component {
  constructor(props) {
    super(props);

    this.talk = this.talk.bind(this);
  }

  talk(text, voice, parameters) {
    console.log('speak.js', text, parameters);
    window.speak(text, voice, parameters);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.text !== nextProps.text) {
      this.talk(nextProps.text, nextProps.voice, nextProps.parameters);
    }
  }

  render() {
    return <div className="speakingDiv" />;
  }
}

Speak.PropTypes = {
  text: PropTypes.string.isRequired,
  voice: PropTypes.string.isRequired,
  parameters: PropTypes.object,
  interactive: PropTypes.bool.isRequired
};

Speak.defaultProps = {
  text: 'default text',
  voice: 'UK English Female',
  interactive: false
};

export default Speak;
