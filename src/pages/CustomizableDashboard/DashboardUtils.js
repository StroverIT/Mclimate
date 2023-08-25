import {Widgets} from "./DashboardWidgets";
import AppUtils from "../../common/AppUtils";

export default class DashboardUtils {
  static widgets = [];
  static widgetColors = ['#FFFFFF', '#000000', '#77BDE7', '#F233B6', '#A2D633', '#DDDDDD', '#EF3339', '#FFDB33', '#7933FF'];

  static addWidget = (widget) => {
    DashboardUtils.widgets.push(widget)
  }

  static findWidgetById = (id) => {
    const foundWidget = DashboardUtils.widgets.find(widget => widget.id === id);
    if (foundWidget) {
      foundWidget.component = foundWidget.component ?? Widgets.find(w => w.type === foundWidget.type)?.component ?? null;
      return foundWidget
    }
    return null;
  }

  static copyDashboard = (dashboard) => {
    const widgets = AppUtils.createObjectCopy(dashboard.widgets);
    const copy = AppUtils.createObjectCopy(dashboard);
    copy.widgets = widgets.map(item => {
      const itemCopy = AppUtils.createObjectCopy(item);
      itemCopy['component'] = Widgets.find(w => w.type === item.type)?.component ?? null
      return itemCopy
    });
    return copy;
  }

  static getFontSize = (size) => {
    switch (size) {
      case 1:
        return '2.25rem'
      case 2:
        return '1.8rem'
      case 3:
        return '1.575rem'
      case 4:
        return '1.35rem'
      case 5:
        return '1.25rem'
      case 6:
        return '0.9rem'
      default:
        return '1.35rem'
    }
  }

  static appendUrlProtocol = (link) => {
    if (link.search(/^http[s]?:\/\//) === -1) {
      link = 'https://' + link;
    }
    return link;
  }
}