import {useState, useEffect} from 'react';
import { gql, useMutation } from "@apollo/client";
import styled from 'styled-components';
import dayjs from 'dayjs';
import {FormGroup, Label, Input, CustomInput, Button, FormFeedback} from 'reactstrap';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
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

const SubmitWrapper = styled.div`
  margin: 24px 0;
`;

const ParametersHolder = styled.div`
  display: flex;
  width: 100%;
  padding: .5rem .5rem 0;
  margin: .5rem .5rem -.5rem .5rem;
  border-radius: ${(props) => props.theme.cardBorderRadius};
  background-color: ${(props) => props.theme.themeColors.light};
`;

const ResetForm = (props) => {
  const { actions } = useFormikContext();

  useEffect(() => {
    actions.resetForm();
  }, [props.type]);
  return null;
}

const InterventionForm = (props) => {

  const { type, parameters, onSubmit } = props;

  let initialValues = {}
  let parametersSchema = Yup.object().shape({});

  parameters?.forEach((param) => {
    // add parameter to form initial values
    initialValues[param.id] = '';

    // add parameter to validation schema
    if(param.__typename === 'InterventionChoiceParameter') {
      const validationObject = Yup.object().shape({
        [param.id]:Yup.string().concat( param.required ? Yup.string().required() : null ),
      });
      parametersSchema = parametersSchema.concat(validationObject);
    }
    if(param.__typename === 'InterventionIntParameter') {
      const validationObject = Yup.object().shape({
        [param.id]:Yup.number()
        .integer('Must be a round number')
        .concat( param.required ? Yup.number().required() : null )
        .concat( param.minValue !== null ? Yup.number().min(param.minValue) : null )
        .concat( param.maxValue !== null ? Yup.number().max(param.maxValue) : null )
        .typeError('Please type a number'),
      });
      parametersSchema = parametersSchema.concat(validationObject);
    }
  });

  return type && (
    <Formik 
      initialValues={initialValues}
      validationSchema={parametersSchema}
      onSubmit={
        (values) => {
        onSubmit(values);
      }}
    >
        {({
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         setFieldValue,
       }) => (
         <Form>
        <ParametersHolder>
          {parameters?.map((parameter)=>(
            <FormGroup key={parameter.id}>
              { parameter.__typename === 'InterventionIntParameter' && (
                <InputWrapper>
                  <Label for={`${parameter.id}Field`}>
                    { parameter.description }
                    { parameter.required && <Required> *</Required>}
                  </Label>
                  <Input
                    type="text"
                    id={`${parameter.id}Field`}
                    name={parameter.id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={Boolean(errors[parameter.id])}
                  />
                  {errors[parameter.id] && touched[parameter.id] ? (
                    <FormFeedback>{errors[parameter.id]}</FormFeedback>
                  ) : null}
                </InputWrapper>
              )}

              { parameter.__typename === 'InterventionChoiceParameter' && (
                <InputWrapper>
                  <Label for={`${parameter.id}Field`}>
                    { parameter.description }
                    { parameter.required && <small>*</small>}
                  </Label>
                  <CustomInput
                    type="select"
                    id={`${parameter.id}Field`}
                    name={parameter.id}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                </InputWrapper>
              )}
            </FormGroup>
          ))}
          <SubmitWrapper>
            <Button
              type="submit"
              disabled={isSubmitting}
              color="primary"
            >Add</Button>
          </SubmitWrapper>
        </ParametersHolder>
         </Form>
        )}
    </Formik>
    )
};

const ADD_INTERVENTION = gql`
  mutation AddNewIntervention($date: String!, $type: ID!, $parameters: [InterventionInputParameter]) {
    addIntervention(intervention: {date: $date, type: $type, parameters: $parameters}) {
        id
    }
  }
`;


const AddIntervention = (props) => {
  const { interventions } = props;

  const [date, setDate] = useState(new Date());
  const [activeIntervention, setActiveIntervention] = useState('');
  const [submitIntervention, { data }] = useMutation(ADD_INTERVENTION);

  function handleInterventionChange(e) {
    setActiveIntervention(e.target.value);
  }

  const serializeInputs = (inputs, interventionType) => {
    let params = [];
    const interventionParameters = interventions.find((element) => element.type === interventionType )?.parameters;

    for (const [key, value] of Object.entries(inputs)) {
      const parameterType = interventionParameters?.find((element) => element.id === key);
      if (parameterType) {
        if (parameterType.__typename === 'InterventionChoiceParameter') params.push({id: key, choice: value})
        else params.push({id: key, value: parseInt(value, 10)})
      }
    }

    return params;
  };

  const handleSubmit = (values) => {
    const newIntervention = {
      type: activeIntervention,
      date: dayjs(date).format('YYYY-MM-DD'),
      parameters: serializeInputs(values, activeIntervention),
    }
    submitIntervention({variables: newIntervention});
    setActiveIntervention('');
    console.log(`Posting new intervention`);
    console.log(newIntervention);
  }

  return (
    <DashCard>
      <h5>Add new event</h5>
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
          <DatePicker
            selected={date}
            onChange={date => setDate(date)}
            dateFormat="dd.MM.yyyy"
          />
        </InputWrapper>
      </FormRow>
      <FormRow>
        <InterventionForm
          type={activeIntervention}
          parameters={interventions.find((element) => element.type === activeIntervention)?.parameters}
          onSubmit={handleSubmit}
        />
      </FormRow>
    </DashCard>
  );
};

export default AddIntervention;
