import React, { Component } from 'react';
import tableau from 'tableau-api';

class tableauParameters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.loadParameters();
  }

  extractParameterData(p) {
    const result = {};
    Object.keys(Object.getPrototypeOf(p)).forEach(k => (result[k] = p[k]));
    return result;
  }

  loadParameters() {
    this.setState({
      isLoading: true
    });

    const wrkbk = tableau.viz
      .getWorkbook()
      .getActiveSheet()
      .getWorksheets()[0];
    console.log(wrkbk);

    tableau.addIn.dashboardContent.dashboard
      .getParametersAsync()
      .then(parameters => {
        parameters.forEach(p => {
          p.addEventListener('parameter-changed', evt => {
            evt.getParameterAsync().then(param => {
              debugger;
              const data = this.extractParameterData(param);
              this.setState(prevState => {
                const newState = Object.assign({}, prevState);
                newState.paramData[data.name] = data;
                return newState;
              });
            });
          });
        });

        const paramNames = parameters.map(p => p.name);
        const paramData = {};
        parameters.forEach(p => {
          paramData[p.name] = this.extractParameterData(p);
        });

        this.setState({
          paramNames: paramNames,
          paramData: paramData
        });
      });
  }

  logParameterData(parameter) {}

  render() {
    const options = {
      height: 375,
      width: 667,
      hideTabs: true
    };

    return <TableauReport url={this.props.url} options={options} />;
  }
}

export default SimpleReport;
