import React from 'react';

class InputTableau extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vizInput: 'Input your viz URL here'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
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
      <form>
        <label>
          Input Tableau Public URL:
          <input
            name="vizInput"
            type="text"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}

export default InputTableau;