import {useState} from 'react';
import styled from 'styled-components';
import {Form, FormGroup, Input, CustomInput, Button} from 'reactstrap';
import DatePicker from 'react-datepicker';
import DashCard from 'components/general/DashCard'

import "react-datepicker/dist/react-datepicker.css";

const EventRow = styled.tr`
  background-color: ${(props) => props.theme.themeColors.light};

  &.import_infections {
    color: ${(props) => props.theme.themeColors.white};
    background-color: ${(props) => props.theme.graphColors.red070};
  }

  &.test_symptomatic, &.test_and_trace, &.test_severe {
    background-color: ${(props) => props.theme.graphColors.blue010};
  }

  &.limit_mobility {
    background-color: ${(props) => props.theme.graphColors.red030};
  }

  &.build_hospital_beds, &.build_icu_units {
    background-color: ${(props) => props.theme.graphColors.blue030};
  }
`;

function handleChange(value, formattedValue) {
  this.setState({
    value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
    formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
  })
}

const AddIntervention = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DashCard>
      <h5>Add event</h5>
      <Form inline>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <CustomInput type="select" id="exampleCustomSelect" name="customSelect">
            <option value="">Select</option>
            <option>Value 1</option>
            <option>Value 2</option>
            <option>Value 3</option>
            <option>Value 4</option>
            <option>Test people only with severe symptoms, given percentage of mild cases are detected</option>
          </CustomInput>
        </FormGroup>
        <FormGroup>
          <Input type="text" name="value" id="exampleEmail" placeholder="value" />
        </FormGroup>
        <Button>Add</Button>
      </Form>
    </DashCard>
  );
};

export default AddIntervention;
