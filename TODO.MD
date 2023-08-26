
--- Before starting the project

[x] Python is not installed
[x] Python is not configured

--- After starting the project

[x] Create a widget option "IFrame" in the Edit Dashboard menu
[] Show the right data in widget
[x] Preview the source of the iframe - This in the edit the widget menu
* Basics
 [x] - Title 
 [x] - When is writen the source of the iframe, show the result in the apperance tab
* Appearance
 -[] Change the border color - OPTIONAL(These means can be added or removed)
 - [] Option to hide the background
 - [] Use Full screen height
 - Description of the iframe widget

----- Documentation through adding the widget



CustomizableDashboard.js - When Edit Dashboard button is hit is going to this menu
WidgetsModal.js - When Add widget is hit, this is the menu that is showing all the modals
DashboardWidgets.js - Data that is showing all the widgets
WidgetCard.js - Component that is responsible for all the widgets
ModalHelper - Component that is handling the modal component. If there is no match, just say oopss, and don't crash 

IFrameEdit.js - Where is the modal Edit functionalities
