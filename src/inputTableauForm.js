import React, {Component} from 'react';

class InputTableau extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vizInput: 'https://public.tableau.com/views/PhaseoftheMoon/MoonPhase?:embed=y&:display_count=yes'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    console.log(event);

    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    console.log(this);
    
    return (
      <div className='tabithaRootDiv'>
        <form>
          <input
            placeholder="Input Tableau Public URL"
            name="vizInput"
            type="text"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange}
            style= {{width: '70%'}} />
          <button
            onClick={this.handleInputChange} >
            <span> Go </span> 
          </button>
        </form>
      </div>
    );
  }
}

export default InputTableau;