import {useState} from 'react';
import styled from 'styled-components';
import {FormGroup, Input, CustomInput, Button} from 'reactstrap';
import DatePicker from 'react-datepicker';
import DashCard from 'components/general/DashCard'

import "react-datepicker/dist/react-datepicker.css";

const Form = styled.div`
  display: flex;
  margin: -.5em;
`;

const InputWrapper = styled.div`
  padding: .5em;
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
      <Form>
        <InputWrapper>
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </InputWrapper>
        <InputWrapper>
          <CustomInput type="select" id="exampleCustomSelect" name="customSelect">
            <option value="">Select</option>
            <option>Value 1</option>
            <option>Value 2</option>
            <option>Value 3</option>
            <option>Value 4</option>
            <option>Test people only with severe symptoms, given percentage of mild cases are detected</option>
          </CustomInput>
        </InputWrapper>
        <InputWrapper>
          <Input type="text" name="value" id="exampleEmail" placeholder="value" />
        </InputWrapper>
        <InputWrapper>
          <Button>Add</Button>
        </InputWrapper>
      </Form>
    </DashCard>
  );
};

export default AddIntervention;
