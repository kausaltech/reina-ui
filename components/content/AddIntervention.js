import {useState} from 'react';
import styled from 'styled-components';
import {FormGroup, Label, Input, CustomInput, Button} from 'reactstrap';
import DatePicker from 'react-datepicker';
import DashCard from 'components/general/DashCard'

import "react-datepicker/dist/react-datepicker.css";

const FormRow = styled.div`
  display: flex;
  margin: .5rem -.5rem;

  label {
    line-height: 1;
  }
`;

const InputWrapper = styled.div`
  padding: 0 .5rem;

  .react-datepicker-wrapper input {
    height: calc(1.5em + 2rem + 2px);
    padding: .75rem .5rem;
  }
`;

const Required = styled.small`
  color: ${(props) => props.theme.graphColors.red070};
`;

const ParametersHolder = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding: .5rem .5rem 0;
  margin: .5rem .5rem -.5rem .5rem;
  border-radius: ${(props) => props.theme.cardBorderRadius};
  background-color: ${(props) => props.theme.themeColors.light};
`;

function handleChange(value, formattedValue) {
  return false;
}

const ParameterInput = (props) => {
  const { parameter, onChangeParameter } = props;

  function handleInputChange(event) {
    onChangeParameter({id: parameter.id, value:event.target.value});
  }

  let inputElement;

  if (parameter.__typename === 'InterventionIntParameter') inputElement = (
    <FormGroup>
      <Label for={`${parameter.id}Field`}>
        { parameter.description }
        { parameter.required && <Required> *</Required>}
      </Label>
      <Input
        type="text"
        id={`${parameter.id}Field`}
        name={parameter.id}
        min={parameter.maxValue}
        max={parameter.maxValue}
        onChange={handleInputChange}
      />
    </FormGroup>
    );

  if (parameter.__typename === 'InterventionChoiceParameter') inputElement = (
    <FormGroup>
      <Label for={`${parameter.id}Field`}>
        { parameter.description }
        { parameter.required && <small>*</small>}
      </Label>
      <CustomInput
        type="select"
        id={`${parameter.id}Field`}
        name={parameter.id}
        onChange={handleInputChange}
      >
        <option value="">Select</option>
        { parameter.choices && parameter.choices.map((choice) => (
          <option
            key={choice.id}
            value={choice.id}
          >
              { choice.label }
          </option>
        ))}
      </CustomInput>
    </FormGroup>
    );
    
    return (
      <InputWrapper>
        {inputElement}
      </InputWrapper>
    );
};

const InterventionParameters = (props) => {
  const { intervention, handleChangeParameters } = props;
  const [interventionType, setIntervention] = useState(intervention.type);
  const [allParameters, setAllParameters] = useState([]);
  
  // If intervention type has changed, reset parameters state
  if(interventionType !== intervention.type) {
    const newParameters = [];
    intervention.parameters.forEach((parameter)=> newParameters.push({id: parameter.id, value:''}));
    setAllParameters(newParameters);
    setIntervention(intervention.type);
  }

  // Update the changed parameter in state array
  const handleInputsChange = (event) => {
    const currentParameters = allParameters;
    const changed = allParameters.findIndex((element) => element.id === event.id);
    currentParameters[changed] = event;
    setAllParameters(currentParameters);
    handleChangeParameters(currentParameters);
  };

  return (intervention.parameters.length > 0) ? (
      <ParametersHolder>
      {intervention.parameters.map((parameter)=>(
        <ParameterInput
          parameter={parameter}
          key={parameter.id}
          onChangeParameter={handleInputsChange}
          intervention={intervention.id}
        />
      ))}
      </ParametersHolder>
    ) : (
      <></>
    )
};

const AddIntervention = (props) => {
  const { interventions } = props;

  const [startDate, setStartDate] = useState(new Date());
  const [activeIntervention, setActiveIntervention] = useState('');
  const [parameters, setParameters] = useState([]);

  function handleInterventionChange(e) {
    setActiveIntervention(e.target.value);
    setParameters([]);
  }

  function handleParametersChange(e) {
    setParameters(e);
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newIntervention = {
      type: activeIntervention,
      date: startDate,
      parameters: parameters,
    }
    console.log(`Adding intervention`);
    console.log(newIntervention);
  }

  return (
    <DashCard>
      <h5>Add new event</h5>
      <form onSubmit={handleSubmit}>
      <FormRow>
        <InputWrapper>
          <CustomInput
            type="select"
            id="interventionTypeField"
            name="interventionType"
            value={activeIntervention}
            onChange={handleInterventionChange}
          >
            <option value="">Select event</option>
            { interventions && interventions.map((intervention) => (
              <option
                key={intervention.type}
                value={intervention.type}
              >
                  { intervention.description }
              </option>
            ))}
          </CustomInput>
        </InputWrapper>
        <InputWrapper>
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </InputWrapper>
        <InputWrapper>
          <Button type="submit">Add</Button>
        </InputWrapper>
      </FormRow>
      <FormRow>
        {activeIntervention && <InterventionParameters
            intervention={interventions.find((element) => element.type === activeIntervention)}
            handleChangeParameters={handleParametersChange}
          /> }
      </FormRow>
      </form>
    </DashCard>
  );
};

export default AddIntervention;
