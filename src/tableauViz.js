import React from 'react';
import TableauReport from 'tableau-react';
 
 
const options = {
  height: 375,
  width: 667,
  hideTabs: true
};

const SimpleReport = props => (
  <TableauReport
    url="https://public.tableau.com/views/PhaseoftheMoon/MoonPhase?:embed=y&:display_count=yes"
    options={options}
  />
)

export default SimpleReport;
