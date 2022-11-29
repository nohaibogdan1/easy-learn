/* eslint-disable */
import React, { ReactElement, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { CourseStored } from '../data/interfaces';
import { useDbStore } from '../stores/db-store/store';
import { BUTTONS_TEXT, ROOT_NAME } from '../constants';
import InsertCourseOrDeckForm from '../components/forms/InsertCourseOrDeckForm';
import { getMenuStateForHomePage, mapButtonsTextToHandlers } from '../logic/menu-helpers';
import ConfirmationForm from '../components/forms/ConfirmationForm';

const HomePage = (): ReactElement => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const {
    state: { db },
    getAllCourses,
    insertCourse
  } = useDbStore();

  const navigate = useNavigate();

  /** ----------------- USE STATE -------------------- */
  const [courses, setCourses] = useState<CourseStored[]>([]);
  const [selectedCoursesId, setSelectedCoursesId] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addingCourseError, setAddingCourseError] = useState<string | null>(null);
  const [addingCourse, setAddingCourse] = useState<boolean>(false);
  const [courseDescription, setCourseDescription] = useState<string>('');

  /** ----------------- USE EFFECT -------------------- */
  useEffect(() => {
    if (db) {
      (async () => {
        await getCourses();
      })();
    }
  }, [Boolean(db)]);

  /** ----------------- DATA HANDLING FUNCTIONS -------------------- */
  const getCourses = async () => {
    try {
      const courses = await getAllCourses();
      setCourses(courses);
    } catch (err) {
      setError('Error when getting courses');
    }
  };

  /** ----------------- BUTTON CLICK HANDLERS -------------------- */
  const onExport = () => {};

  const onAddCourse = async () => {
    setAddingCourseError(null);
    setAddingCourse(true);
  };

  const onCancel = () => {
    setAddingCourse(false);
  };

  const onOk = async () => {
    try {
      if (!Boolean(courseDescription.trim())) {
        setAddingCourseError('you did not enter description');
        return;
      }

      await insertCourse({ description: courseDescription });
      setAddingCourse(false);
      getCourses();
    } catch (err) {
      setAddingCourseError('Error on inserting the course');
    }
  };

  const onCheckboxChange = ({ checked, id }: { checked: boolean; id: number }): void => {
    setSelectedCoursesId((selectedCoursesId) => {
      if (checked) {
        return [...selectedCoursesId, id];
      }
      return [...selectedCoursesId.filter((courseId) => courseId !== id)];
    });
  };

  const onSelectAll = (): void => {
    setSelectedCoursesId(() => courses.map((course) => course.id));
  };

  const onUnselectAll = (): void => {
    setSelectedCoursesId(() => []);
  };

  const onRedirect = (id: number): void => {
    navigate(`/${ROOT_NAME}/courses/${id}`);
  };

  const onPlay = () => {
    navigate(`/${ROOT_NAME}/test/`);
  };

  const onPlaySelected = () => {
    navigate(`/${ROOT_NAME}/test/`, { 
      state: { 
        coursesIds: selectedCoursesId,
      }
    });
  };

  /** ----------------- VARIABLES -------------------- */

  const buttonTextHandlersMap = {
    [BUTTONS_TEXT.PLAY]: onPlay,
    [BUTTONS_TEXT.PLAY_SELECTED]: onPlaySelected,
    [BUTTONS_TEXT.ADD_COURSE]: onAddCourse,
    [BUTTONS_TEXT.SELECT_ALL]: onSelectAll,
    [BUTTONS_TEXT.UNSELECT_ALL]: onUnselectAll,
    [BUTTONS_TEXT.OK]: onOk,
    [BUTTONS_TEXT.CANCEL]: onCancel,
    // [BUTTONS_TEXT.EXPORT]: onExport
  };

  const { firstDesktopSubmenu, secondDesktopSubmenu, firstMobileSubmenu, secondMobileSubmenu } =
    getMenuStateForHomePage({
      addingCourse,
      allSelected:
        Boolean(courses.length) && courses.every((course) => selectedCoursesId.includes(course.id)),
      selected: Boolean(selectedCoursesId.length),
      haveCourses: Boolean(courses.length)
    });

  const firstDesktopSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: firstDesktopSubmenu
  });

  const secondDesktopSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: secondDesktopSubmenu
  });

  const firstMobileSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: firstMobileSubmenu
  });

  const secondMobileSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: secondMobileSubmenu
  });

  /** ----------------- RETURN -------------------- */
  return (
    <div className="page-wrapper home-page-wrapper ">
      <div className="top-section">
        <ButtonsGroup className={'direction-column margin-right-medium'}>
          {firstDesktopSubmenuButtons.map((btn, idx) => {
            return <PrimaryButton key={idx} text={btn.text} onClick={btn.onClick} />;
          })}
          <ButtonsGroup className={'margin-top-medium wrap'}>
            {secondDesktopSubmenuButtons.map((btn, idx) => {
              return <SecondaryButton key={idx} text={btn.text} onClick={btn.onClick} />;
            })}
          </ButtonsGroup>
        </ButtonsGroup>
        {/* <StatisticsGroup className="direction-column">
          <Statistics value="22345" description="This month" />
          <Statistics value="22345" description="This week" />
          <Statistics value="22345" description="Yesterday" />
          <Statistics value="22345" description="Today" />
        </StatisticsGroup> */}
      </div>

      <div className="bottom-section">
        <h3 className="mobile-margin-exterior">Courses</h3>
        <List>
          {courses.map((course) => {
            const checked = Boolean(selectedCoursesId.find((courseId) => courseId === course.id));

            return (
              <ListItem
                key={course.id}
                showArrow
                text={course.description}
                id={course.id}
                usesCheckbox
                onCheckboxChange={onCheckboxChange}
                checked={checked}
                onRedirect={onRedirect}
              />
            );
          })}
        </List>
      </div>

      <MobileMenu>
        {Boolean(firstMobileSubmenuButtons.length) && (
          <MobileSubmenu className="space-evenly">
            {firstMobileSubmenuButtons.map((button) => (
              <MobileMenuItem key={button.text} text={button.text} onClick={button.onClick} />
            ))}
          </MobileSubmenu>
        )}
        {Boolean(secondMobileSubmenuButtons.length) && (
          <MobileSubmenu>
            {secondMobileSubmenuButtons.map((button) => (
              <MobileMenuItem key={button.text} text={button.text} onClick={button.onClick} />
            ))}
          </MobileSubmenu>
        )}
      </MobileMenu>

      {addingCourse && (
        <ConfirmationForm
          onOk={onOk}
          onCancel={onCancel}
          error={addingCourseError}
          data={courseDescription}
          setData={setCourseDescription}
          message={"Enter the description of the course"}
        />
      )}
    </div>
  );
};

export default HomePage;
