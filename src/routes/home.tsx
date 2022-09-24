/* eslint-disable */
import React, { ReactElement } from 'react';

import './home.css';
import Statistics from '../components/Statistics';
import StatisticsGroup from '../components/StatisticsGroup';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import ListItem from '../components/list/ListItem';
import List from '../components/list/List';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';

const HomePage = (): ReactElement => {
  return (
    <div className="page-wrapper home-page-wrapper">
      <div className="top-section">
        <ButtonsGroup className={'direction-column margin-right-medium'}>
          <PrimaryButton text="Quick play" />
          <ButtonsGroup className={'margin-top-medium wrap'}>
            <SecondaryButton text="Add course" />
            <SecondaryButton text="Select all" />
            <SecondaryButton text="Select all" />
          </ButtonsGroup>
        </ButtonsGroup>
        <StatisticsGroup className="direction-column">
          <Statistics value="22345" description="This month" />
          <Statistics value="22345" description="This week" />
          <Statistics value="22345" description="Yesterday" />
          <Statistics value="22345" description="Today" />
        </StatisticsGroup>
      </div>
      <div className="bottom-section">
        <h3 className="mobile-margin-exterior">Courses</h3>
        <List>
          <ListItem
            usesCheckbox
            showArrow
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
        </List>
      </div>

      <MobileMenu>
        <MobileSubmenu className="space-evenly">
          <MobileMenuItem text="Quick play" />
          <MobileMenuItem text="Add course" />
        </MobileSubmenu>
      </MobileMenu>
    </div>
  );
};

export default HomePage;
