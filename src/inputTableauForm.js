import React, {Component} from 'react';
import SimpleReport from './tableauViz.js'

class InputTableau extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vizInput: 'https://public.tableau.com/views/PhaseoftheMoon/MoonPhase?:embed=y&:display_count=yes'
    };

    //console.log(this.state);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    console.log(event);
    const target = event.target;
    const value = target.value;
    const name = target.name;

    //this.props({ url: event.target.value });
    this.setState({ vizInput: event.target.value});
  }

/*
  constructor(props) {
    super(props);
    this.state = {
      vizInput: 'https://public.tableau.com/views/PhaseoftheMoon/MoonPhase?:embed=y&:display_count=yes'
    };

    console.log(this.state);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    console.log(event);
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      url=event.target.value
    });
  }
*/

  render() {
    return (
      <div className='tabithaRootDiv'>
        <form>
          <input
            placeholder="Input Tableau Public URL"
            name="vizInput"
            type="text"
            style= {{width: '70%'}} />
          <button
            onClick={this.handleInputChange} >
            <span> Submit to Tabitha </span> 
          </button>
        </form>
      <br />
      <SimpleReport
        url={this.state.vizInput} />
      </div>
    );
  }
}

export default InputTableau;