import styled from 'styled-components';
import { Nav, NavItem as BSNavItem, NavLink } from 'reactstrap';

const SideNav = styled.div`
  width: 240px;
  min-height: 100vh;
  padding: ${(props)=>props.theme.spaces.s100};

  background-color: ${(props)=>props.theme.themeColors.dark};
  color: ${(props)=>props.theme.themeColors.light};
`;

const SideHeader = styled.div`
  margin-bottom: ${(props)=>props.theme.spaces.s100};
`;

const AppTitle = styled.h1`
  margin-bottom: 0;
  font-size: ${(props)=>props.theme.fontSizeLg};
  line-height: ${(props)=>props.theme.lineHeightSm};
  font-weight: ${(props) => props.theme.fontWeightBold };
  color: ${(props)=>props.theme.themeColors.light};
  letter-spacing: 4px;
`;

const NavItem = styled(BSNavItem)`
  a {
    color: ${(props)=>props.theme.themeColors.light};

    &:hover {
      color: ${(props)=>props.theme.brandLight};
    }
  }
`;

const SideBarNav = ({ children }) => {
  return (
    <SideNav>
      <SideHeader>
        <AppTitle>REINA</AppTitle>
        <small><span className="badge badge-secondary">v2.0-dev</span></small>
      </SideHeader>
      <Nav vertical>
        <NavItem>
          <NavLink href="#" active>Scenario</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Events</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Disease parameters</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Region</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">About REINA</NavLink>
        </NavItem>
      </Nav>
    </SideNav>
  );
};

export default SideBarNav;
