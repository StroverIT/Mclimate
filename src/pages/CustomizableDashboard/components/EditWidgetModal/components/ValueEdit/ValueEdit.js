import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Tab, Tabs} from "@material-ui/core";
import ValuePreview from "./components/ValuePreview/ValuePreview";
import {withStyles} from "@material-ui/core/styles";
import {TAB, ValueWidgetTabs} from "./components/Tabs/Tabs";
import * as React from "react";
import { v4 as uuidv4 } from 'uuid';
import {useDispatch} from "react-redux";
import {setValues} from "../../../../../../store/valuePreview/actions";
import {initialState} from "../../../../../../store/valuePreview/reducer";
import AppUtils from "../../../../../../common/AppUtils";
import "./valueEdit.scss";

const TabPanel = (props) => {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        children
      )}
    </div>
  );
}

const CustomTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#56AFE0',
  },
})(Tabs);

const CustomTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    '&:hover': {
      color: '#56AFE0',
      opacity: 1,
    },
    '&$selected': {
      color: '#56AFE0',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#56AFE0',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const ValueEdit = forwardRef(({widget}, ref) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    return () => {
      dispatch(setValues(AppUtils.createObjectCopy(initialState.values)));
    }
  }, [])

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useImperativeHandle(ref, () => ({
    getWidgetData() {
      return ValueWidgetTabs[activeTab].ref.current.getData();
    },
    checkFieldsValidity() {
      return true;
    }
  }))

  return (
    <>
      <ValuePreview/>
      <div>
        <CustomTabs value={activeTab}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={'auto'}
              indicatorColor="primary"
              textColor="inherit"
        >
          <CustomTab label="Basic" {...a11yProps(TAB.BASIC)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
          <CustomTab label="Data" {...a11yProps(TAB.DATA)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
          <CustomTab label="Appearance" {...a11yProps(TAB.APPEARANCE)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
          <CustomTab label="Style" {...a11yProps(TAB.STYLE)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
          <CustomTab label="Timeframe" {...a11yProps(TAB.TIMEFRAME)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
        </CustomTabs>
      </div>
      {
        ValueWidgetTabs.map(tab => {
          return <TabPanel key={uuidv4()} value={activeTab} index={tab.index}>
            {
              React.cloneElement(tab.component, {ref: tab.ref})
            }
          </TabPanel>
        })
      }
    </>
  )
})

export default ValueEdit;