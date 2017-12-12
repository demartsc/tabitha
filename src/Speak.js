import React from 'react';
import PropTypes from 'prop-types';
import responsiveVoice from 'responsivevoice';

class Speak extends React.Component {
  constructor(props) {
    super(props);

    this.talk = this.talk.bind(this);
  }

  talk() {
    console.log('speak.js', this.props, this.props.parameters);
    window.speak(this.props.text, this.props.voice, this.props.parameters);
  }

  render() {
    return <div className="speakingDiv">{this.talk()}</div>;
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
