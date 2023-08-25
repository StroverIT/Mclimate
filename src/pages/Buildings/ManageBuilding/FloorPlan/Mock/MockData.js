import {MockDataUtils} from "./MockDataUtils";

export const getFloorPlan = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        image: `data:image/png;base64,${MockDataUtils.floorPlanImage}`,
        devices: [
          {
            id: 70361,
            tooltipBadges: {
              show: true,
              showWhen: 'active'
            },
            infoBlock: {
              show: true,
              showWhen: 'hover'
            },
            coordinates: [
              51, 14
            ],
            settings: {
              name: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              displayDigits: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              temperature: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              motorPosition: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              humidity: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              batteryVoltage: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              rssi: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              spf: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              frameCount: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              },
              lastActive: {
                badgeVisibility: true,
                infoBlockVisibility: true,
              }
            }
          },
          {
            id: 70264,
            tooltipBadges: {
              show: true,
              showWhen: 'active'
            },
            infoBlock: {
              show: false,
              showWhen: 'hover'
            },
            coordinates: [
              41, 24
            ],
            settings: {
              name: {
                badgeVisibility: true,
                infoBlockVisibility: false,
              },
              sensorTemperature: {
                badgeVisibility: true,
                infoBlockVisibility: false,
              },
              relativeHumidity: {
                badgeVisibility: true,
                infoBlockVisibility: false,
              },
              batteryVoltage: {
                badgeVisibility: true,
                infoBlockVisibility: false,
              },
              rssi: {
                badgeVisibility: true,
                infoBlockVisibility: false,
              },
              spf: {
                badgeVisibility: true,
                infoBlockVisibility: false,
              },
              frameCount: {
                badgeVisibility: true,
                infoBlockVisibility: false,
              },
              lastActive: {
                badgeVisibility: true,
                infoBlockVisibility: false,
              }
            }
          },
        ]
      });
    }, 100);
  });
}

export const getEmptyFloorPlan = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, 100);
  });
}

export const deleteFloorPlan = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: "Floor plan was successfully deleted!"});
    }, 100);
  });
}

export const saveFloorPlan = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: data});
    }, 100);
  });
}