import React, {Component} from 'react';
import SimpleReport from './tableauViz.js'

class InputTableau extends Component {
 constructor(props) {
    super(props);
    this.state = { url: this.props.url, oldURL: this.props.url };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleInputChange(event) {
    this.state = {url: event.target.value};
    //this.props({url: event.target.value});
  }

  handleButtonClick(event) {
    let tempURL = this.state.url;
    this.setState({ oldURL: tempURL });
    console.log(this.state);
    //this.props({ url: event.target.value });
  }

  render() {
    console.log(this.state);
    return (
      <div className='tabithaRootDiv'>
        <input
          onChange={this.handleInputChange}
          placeholder="Input Tableau Public URL"
          name="vizInput"
          type="text"
          style= {{width: '70%'}} />
        <button
          onClick={this.handleButtonClick}>
          Submit to Tabitha
        </button>
      <br />
      <br />
      <SimpleReport
        url={this.state.oldURL} />
      </div>
    );
  }
}

export default InputTableau;

/*
          <button
            onClick={handleButtonClick}>
            Submit to Tabitha
          </button>
*/