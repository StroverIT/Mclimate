import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {batch, useDispatch, useSelector} from "react-redux";
import {
  setChartData,
  setControllersFields,
  setChartWidgetValues,
  setChartWidgetEditMode
} from "../../../../../../store/chartWidget/actions";
import AppUtils from "../../../../../../common/AppUtils";
import {v4 as uuidv4} from "uuid";
import {withStyles} from "@material-ui/core/styles";
import {Tab, Tabs} from "@material-ui/core";
import {chartWidgetTabs, TAB} from "./components/Tabs/Tabs";
import {initialChartWidgetState} from "../../../../../../store/chartWidget/reducer";
import {ChartPreview} from "./components/ChartPreview/ChartPreview";
import {controllersChartData, resetMixChartData} from "./helpers";
import './chartEdit.scss'

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

const ChartEdit = forwardRef(({widget}, ref) => {
  const dispatch = useDispatch();
  const editMode = useSelector(store => store.chartWidget.editMode);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (editMode) {
      updateControllersFields();
    }
    return () => {
      batch(() => {
        resetMixChartData();
        dispatch(setChartWidgetEditMode(false));
        dispatch(setChartWidgetValues(AppUtils.createObjectCopy(initialChartWidgetState.values)));
        dispatch(setChartData(controllersChartData));
        dispatch(setControllersFields({}));
      })
    }
  }, [])

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const updateControllersFields = () => {
    const fields = {};
    widget.config.data.selectedDevices.forEach(device => {
      if (device.selectedField) {
        if (!fields.hasOwnProperty(device.serialNumber)) {
          fields[device.serialNumber] = AppUtils.getControllerFieldsByType(device.type);
        }
        const fieldIndex = fields[device.serialNumber].findIndex(field => field.value === device.selectedField.value);
        if (fieldIndex !== -1) {
          fields[device.serialNumber].splice(fieldIndex, 1);
        }
      }
    })
    dispatch(setControllersFields(fields));
  }

  useImperativeHandle(ref, () => ({
    getWidgetData() {
      return chartWidgetTabs[activeTab].ref.current.getData();
    },
    checkFieldsValidity() {
      return true;
    }
  }))

  return (
    <>
      <ChartPreview />
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
          <CustomTab label="Axes" {...a11yProps(TAB.AXES)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
          <CustomTab label="Timeframe" {...a11yProps(TAB.TIMEFRAME)} style={{fontWeight: 500, textTransform: 'capitalize', padding: 0}}/>
        </CustomTabs>
      </div>
      {
        chartWidgetTabs.map(tab => {
          return <TabPanel key={uuidv4()} value={activeTab} index={tab.index}>
            {
              React.cloneElement(tab.component, {ref: tab.ref})
            }
          </TabPanel>
        })
      }
    </>
  )
});

export default ChartEdit;