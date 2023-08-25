import HeadlineEdit from "../components/HeadlineEdit/HeadlineEdit";
import TextEdit from "../components/TextEdit/TextEdit";
import ImageEdit from "../components/ImageEdit/ImageEdit";
import ValueEdit from "../components/ValueEdit/ValueEdit";
import ChartEdit from "../components/ChartEdit/ChartEdit";
import BooleanEdit from "../components/BooleanEdit/BooleanEdit";

export const renderWidgetBody = (widget, ref) => {
  if (widget) {
    switch (widget.type) {
      case 'headline':
        return <HeadlineEdit widget={widget} ref={ref}/>
      case 'text':
        return <TextEdit widget={widget} ref={ref}/>
      case 'image':
        return <ImageEdit widget={widget} ref={ref}/>
      case 'value':
        return <ValueEdit widget={widget} ref={ref}/>
      case 'chart':
        return <ChartEdit widget={widget} ref={ref}/>
      case 'boolean':
        return <BooleanEdit widget={widget} ref={ref}/>
      default:
        return <div>Ooops, something went wrong</div>
    }
  }
  return <div />
}