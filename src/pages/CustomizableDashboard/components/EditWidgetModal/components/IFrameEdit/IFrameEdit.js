import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Tab, Tabs} from "@material-ui/core";
import {useDispatch} from "react-redux";
import IFramePreview from "./components/IFramePreview/IFramePreview";
import {iframeWidgetTabs, TAB} from "./components/Tabs/Tabs";
import {v4 as uuidv4} from "uuid";
import {setIframeWidgetValues} from "../../../../../../store/iframeWidget/actions";
import AppUtils from "../../../../../../common/AppUtils";
import {initialIframeWidgetState} from "../../../../../../store/iframeWidget/reducer";

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

const BooleanEdit = forwardRef(({widget}, ref) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    return () => {
      dispatch(setIframeWidgetValues(AppUtils.createObjectCopy(initialIframeWidgetState.values)))
    }
  }, [])

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useImperativeHandle(ref, () => ({
    getWidgetData() {
      return iframeWidgetTabs[activeTab].ref.current.getData();
    },
    checkFieldsValidity() {
      return true;
    }
  }))

  return (
    <>
      <IFramePreview/>
      <div>
        <CustomTabs value={activeTab}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons={'auto'}
                    indicatorColor="primary"
                    textColor="inherit"
        >
          <CustomTab label="Basics" {...a11yProps(TAB.BASIC)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
          <CustomTab label="Appearance" {...a11yProps(TAB.APPEARANCE)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
        </CustomTabs>
      </div>
      {
        iframeWidgetTabs.map(tab => {
          return <TabPanel key={uuidv4()} value={activeTab} index={tab.index}>
            {
              React.cloneElement(tab.component, {ref: tab.ref})
            }
          </TabPanel>
        })
      }
    </>
  );
});

export default BooleanEdit;