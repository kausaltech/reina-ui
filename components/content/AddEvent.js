import {useState} from 'react';
import { gql, useMutation } from "@apollo/client";
import styled from 'styled-components';
import dayjs from 'dayjs';
import {FormGroup, Label, Input, CustomInput, Button, FormFeedback, Spinner} from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'i18n';


import "react-datepicker/dist/react-datepicker.css";

const FormRow = styled.div`
  display: flex;
  margin: .5rem -.5rem 1rem;

  label {
    line-height: 1;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  form {
    width: 100%;
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
  margin: 18px 0 24px 18px;
`;

const ParametersHolder = styled.div`
  display: flex;
  padding: .5rem .5rem 0;
  margin: .5rem;
  border-radius: ${(props) => props.theme.cardBorderRadius};
  background-color: ${(props) => props.theme.themeColors.light};
`;

const EventForm = (props) => {
  const { type, parameters, onSubmit } = props;
  const { t } = useTranslation(['common']);

  let initialValues = {}
  let parametersSchema = Yup.object().shape({});

  parameters?.forEach((param) => {
    // add parameter to form initial values
    initialValues[param.id] = '';

    // add parameter to validation schema
    if(param.__typename === 'EventChoiceParameter') {
      const validationObject = Yup.object().shape({
        [param.id]:Yup.string().concat( param.required ? Yup.string().required() : null ),
      });
      parametersSchema = parametersSchema.concat(validationObject);
    }
    if(param.__typename === 'EventIntParameter') {
      const validationObject = Yup.object().shape({
        [param.id]:Yup.number()
        .integer(t('must-be-integer'))
        .concat( param.required ? Yup.number().required() : null )
        .concat( param.minValue !== null ? Yup.number().min(param.minValue) : null )
        .concat( param.maxValue !== null ? Yup.number().max(param.maxValue) : null )
        .typeError(t('must-be-number')),
      });
      parametersSchema = parametersSchema.concat(validationObject);
    }
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      onSubmit(values);
      resetForm();
    }
    catch (err) {
      console.log(err);
      setErr(err.message);
    }
  };

  return type && (
    <FormWrapper>
      <Formik 
        initialValues={initialValues}
        validationSchema={parametersSchema}
        onSubmit={handleSubmit}
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
                { parameter.__typename === 'EventIntParameter' && (
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

                { parameter.__typename === 'EventChoiceParameter' && (
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
    </FormWrapper>
    )
};

const ADD_EVENT = gql`
  mutation AddNewEvent($date: String!, $type: EventType!, $parameters: [EventInputParameter]) {
    addEvent(event: {date: $date, type: $type, parameters: $parameters}) {
        id
    }
  }
`;


const AddEvent = (props) => {
  const { events, handleSuccess, loading } = props;
  const { t } = useTranslation(['common']);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow);
  const [activeEvent, setActiveEvent] = useState('');
  const [submitEvent, { data: addedEvent, loading: addingEvent }] = useMutation(ADD_EVENT, {
    onCompleted({data}) {
      setActiveEvent('');
      handleSuccess();
      console.log(`New event added`);
      console.log(data);
    }
  });

  function handleEventChange(e) {
    setActiveEvent(e.target.value);
  }

  const serializeInputs = (inputs, eventType) => {
    let params = [];
    const eventParameters = events.find((element) => element.type === eventType )?.parameters;

    for (const [key, value] of Object.entries(inputs)) {
      const parameterType = eventParameters?.find((element) => element.id === key);
      if (parameterType) {
        if (parameterType.__typename === 'EventChoiceParameter') params.push({id: key, choice: value})
        else params.push({id: key, value: parseInt(value, 10)})
      }
    }

    return params;
  };

  const handleSubmit = (values) => {
    const newEvent = {
      type: activeEvent,
      date: dayjs(date).format('YYYY-MM-DD'),
      parameters: serializeInputs(values, activeEvent),
    }
    submitEvent({variables: newEvent});
  }

  return (
    <div>
      <h5>{ t('add-new-event') }</h5>
      { loading ?
        <div className="d-flex justify-content-center align-items-center w-100 my-5"><div><Spinner type="grow" color="secondary" /></div></div>
        : (
          <div>
            <FormRow>
              <InputWrapper>
                <CustomInput
                  type="select"
                  id="eventTypeField"
                  name="eventType"
                  value={activeEvent}
                  onChange={handleEventChange}
                >
                  <option value="">{ t('select-event') }</option>
                  { events && events.map((event) => (
                    <option
                      key={event.type}
                      value={event.type}
                    >
                        { event.description }
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
              <EventForm
                type={activeEvent}
                parameters={events.find((element) => element.type === activeEvent)?.parameters}
                onSubmit={handleSubmit}
              />
            </FormRow>
          </div>
        )}
    </div>
  );
};

export default AddEvent;
