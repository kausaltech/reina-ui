import DashCard from 'components/general/DashCard'
import styled from 'styled-components';

const IndicatorTitle = styled.h3`
  margin-bottom: ${(props) => props.theme.spaces.s100 };
  font-size: ${(props)=>props.theme.fontSizeBase};
  line-height: ${(props)=>props.theme.lineHeightSm};
  font-weight: ${(props) => props.theme.fontWeightBold };
`;

const IndicatorValue = styled.div`
  margin-bottom: ${(props) => props.theme.spaces.s100 };
  font-size: ${(props)=>props.theme.fontSizeXl};
  line-height: ${(props)=>props.theme.lineHeightSm};
  font-weight: ${(props) => props.theme.fontWeightBold };
  color: ${(props) => props.theme.brandDark };
`;

const InfoText = styled.div`
  font-size: ${(props)=>props.theme.fontSizeSm};
  line-height: ${(props)=>props.theme.lineHeightMd};
`;

const KeyIndicator = (props) => {
  const { title, value, info } = props;
  return (
    <DashCard>
      <div>
        <IndicatorTitle>{ title }</IndicatorTitle>
        <IndicatorValue>{ value }</IndicatorValue>
        <InfoText>{ info }</InfoText>
      </div>
    </DashCard>
  );
};

export default KeyIndicator;

