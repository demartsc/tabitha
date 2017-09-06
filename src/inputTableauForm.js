import React, {Component} from 'react';
import SimpleReport from './tableauViz.js'

class InputTableau extends Component {
 constructor(props) {
    super(props);
    this.state = { url: this.props.url };
    console.log(this.state.url);
  }

  render() {
    let tempURL = '';
    const handleInputChange = (event) => {
      tempURL = event.target.value;
      console.log(tempURL);
      //this.props({url: event.target.value});
    }

    const handleButtonClick = (event) => {
      console.log(tempURL);
      this.state = { url: tempURL };
      //this.props({ url: event.target.value });
    }

    return (
      <div className='tabithaRootDiv'>
        <form>
          <input
            onChange={handleInputChange}
            placeholder="Input Tableau Public URL"
            name="vizInput"
            type="text"
            style= {{width: '70%'}} />
          <button
            onClick={handleButtonClick}>
            Submit to Tabitha
          </button>
        </form>
      <br />
      <SimpleReport
        url={this.state.url} />
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