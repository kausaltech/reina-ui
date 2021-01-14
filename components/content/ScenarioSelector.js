import styled from 'styled-components';
import { i18n, Link } from 'i18n';
import { gql, useMutation, useQuery } from "@apollo/client";
import { CustomInput, Label, Button } from 'reactstrap';
import { useTranslation } from 'i18n';

const ButtonToolbar = styled.div`
  display: flex;
  padding: 1rem 0;
`;

const RESET_EVENTS = gql`
  mutation ResetVariables {
    resetVariables {
      ok
    }
  }
`;

const GET_SCENARIOS = gql`
  query getScenarios {
    scenarios {
      id
      label
      description
      active
    }
  }
`;

const CHANGE_SCENARIO = gql`
  mutation activateScenario($scenarioId: ID!) {
    activateScenario(scenarioId: $scenarioId) {
      ok
    }
  }
`;

/* https://icons.getbootstrap.com/icons/pencil-fill/ */
const IconPen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
  </svg>
);

/* https://icons.getbootstrap.com/icons/pencil-fill/ */
const IconRun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
    <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
  </svg>
);

const ScenarioSelector = (props) => {
  const { handleUpdate, edit, run } = props;
  const { t } = useTranslation(['common']);
  let scenarios = [];

  const { loading, error, data } = useQuery(GET_SCENARIOS);
  if (loading) {
    scenarios = [{ id: 'loading', label: t('loading'), description: '', active: true }];
  } else if (error) {
    scenarios = [{ id: 'error', label: '?', description: t('error-loading-scenarios'), active: true }];
  } else scenarios = JSON.parse(JSON.stringify(data.scenarios));

  // JSON.parse(JSON.stringify(data.scenarios));
  let activeScenario = scenarios.find((scenario) => scenario.active);
  if (!activeScenario) {
    activeScenario= {
      id: 'custom',
      label: t('custom-scenario'),
      description: t('custom-scenario-description'),
      active: true,
    };
    scenarios.push(activeScenario);
  };

  const [activateScenario] = useMutation(CHANGE_SCENARIO, {
    onCompleted({data}) {
      // handleUpdate(); Refresh parent maybe if needed? Refresh this component, load scenarios again?
    }
  });

  const [resetEvents] = useMutation(RESET_EVENTS, {
    onCompleted({data}) {
      //handleUpdate();
    }
  });

  const handleChange = (evt) => {
    resetEvents();
    activateScenario({variables: { scenarioId: evt.target.value }});
  };
  
  return (
    <div>
      <Label>{ t('select-scenario') }</Label>
      <CustomInput
        type="select"
        id="select-scenario"
        value={activeScenario.id}
        onChange={handleChange}
      >
        { scenarios.map((scenario) => <option value={scenario.id} key={scenario.id}>{ scenario.label }</option> )}
      </CustomInput>
      <small>{ activeScenario.description }</small>
      <ButtonToolbar>
        { edit &&
          <Link href="/scenario" passHref>
            <Button size="sm" color="secondary" className="mr-3"><IconPen /> { t('edit-scenario-events') }</Button>
          </Link>
        }
        { run &&
          <Link href="/" passHref>
            <Button size="sm" color="primary" className="mr-3"><IconRun /> { t('see-results') }</Button>
          </Link>
        }
      </ButtonToolbar>
    </div>
  );
};

export default ScenarioSelector;
