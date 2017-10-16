import React from 'react';
import PropTypes from 'prop-types';
import responsiveVoice from 'responsivevoice';

class Speak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.talk = this.talk.bind(this);
  }

  talk() {
    console.log(this.props);
    window.speak(this.props.text, this.props.voice);
  }

  //left off here, the issue is that the state is set before the voices are mapped
  componentDidMount() {
    var that = this;
    setTimeout(function() {
      that.setState({ loading: false });
      console.log('timeout happened');
    }, 1000);
  }

  render() {
    return <div className="speakingDiv">{this.talk()}</div>;
  }
}

Speak.PropTypes = {
  text: React.PropTypes.string.isRequired,
  voice: React.PropTypes.string.isRequired,
  loading: React.PropTypes.bool
};

Speak.defaultProps = {
  text: 'default text',
  voice: 'UK English Female',
  loading: false
};

export default Speak;
