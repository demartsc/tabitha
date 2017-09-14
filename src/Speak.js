import React, { Component, PropTypes } from 'react';
import responsiveVoice from 'responsivevoice';

class Speak extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      voice: this.props.voice,
      loading: true
    };

    this.talk = this.talk.bind(this);
  }

  talk() {
    console.log(this.state);
    window.speak(this.state.text, this.state.voice);
  }

  //left off here, the issue is that the state is set before the voices are mapped
  componentDidMount() {
    this.setState({ loading: false });
    //this.setState({text: this.props.text, voice: this.props.voice});
  }

  render() {
    return <div className="speakingDiv">{this.talk()}</div>;
  }
}

export default Speak;
