import React, {Component} from 'react';
import TableauReport from 'tableau-react';


class SimpleReport extends Component {
	render() {

		const options = {
		  height: 375,
		  width: 667,
		  hideTabs: true
		};

		//console.log(this.props);
		return (
		  <TableauReport
		    url={this.props.url}
		    options={options}
		  />
		)
	}
}

export default SimpleReport;
