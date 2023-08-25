export const mapDevices = (currentBuilding, device, mappedAssetDevices, mappedBuildingDevices) => {
  const deviceContentObj = {
    title: device.controller.name,
    serialNumber: device.controller.serial_number,
    type: device.controller.type,
    online: device.controller_log?.online
  }

  if (device.floor_id !== null) {
    const foundFloor = mappedAssetDevices.find(el => el.id === device.floor_id);
    if (foundFloor) {
      if (device.space_id !== null) {
        const foundSpace = foundFloor.content?.find(space => space.id === device.space_id);
        if (foundSpace) {
          if (device.room_id !== null) {
            const foundRoom = foundSpace.content?.find(room => room.id === device.room_id);
            if (foundRoom) {
              if (foundRoom.content) {
                foundRoom.content[device.controller_id] = deviceContentObj;
              } else {
                foundRoom.content = {
                  [device.controller_id]: deviceContentObj
                }
              }
            } else {
              // We don't have room with such id, so we create a new one => newRoom
              const newRoom = {
                id: device.room_id,
                type: 'room',
                title: currentBuilding.rooms.find(room => room.id === device.room_id)?.name,
                content: {
                  [device.room_id]: deviceContentObj
                }
              }
              foundSpace['content'] ? foundSpace['content'].push(newRoom) : foundSpace['content'] = [newRoom];
            }
          } else {
            // Device has no room id => Device is attached directly to space
            if (foundSpace.devices) {
              foundSpace.devices[device.controller_id] = deviceContentObj;
            } else {
              foundSpace.devices = {
                [device.controller_id]: deviceContentObj
              }
            }
          }
        } else {
          // We don't have space with such id, so we create a new one => newSpace
          const newSpace = {
            id: device.space_id,
            type: 'space',
            title: currentBuilding.spaces.find(space => space.id === device.space_id)?.name,
          }
          if (device.room_id !== null) {
            newSpace['content'] = [{
              id: device.room_id,
              type: 'room',
              title: currentBuilding.rooms.find(room => room.id === device.room_id)?.name,
              content: {
                [device.controller_id]: deviceContentObj
              }
            }]
          } else {
            // Device has no room id => Device is attached directly to newSpace
            newSpace['devices'] = {
              [device.controller_id] : deviceContentObj
            };
          }
          foundFloor['content'] ? foundFloor['content'].push(newSpace) : foundFloor['content'] = [newSpace];
        }
      } else {
        // Device has no space id => Device is attached directly to floor
        if (foundFloor.devices) {
          foundFloor.devices[device.controller_id] = deviceContentObj;
        } else {
          foundFloor.devices = {
            [device.controller_id]: deviceContentObj
          }
        }
      }
    } else {
      // We don't have floor with such id, so we create a new one => newFloor
      const newFloor = {
        id: device.floor_id,
        type: 'floor',
        title: currentBuilding.floors.find(floor => floor.id === device.floor_id)?.name,
      }
      if (device.space_id !== null) {
        // Device has space id
        if (device.room_id !== null) {
          // Device has room id
          newFloor['content'] = [{
            id: device.space_id,
            type: 'space',
            title: currentBuilding.spaces.find(space => space.id === device.space_id)?.name,
            content: [{
              id: device.room_id,
              type: 'room',
              title: currentBuilding.rooms.find(room => room.id === device.room_id)?.name,
              content: {
                [device.controller_id]: deviceContentObj
              }
            }]
          }]
        } else {
          // Device has no room id => Device is attached directly to space
          newFloor['content'] = [{
            id: device.space_id,
            type: 'space',
            title: currentBuilding.spaces.find(space => space.id === device.space_id)?.name,
            devices: {
              [device.controller_id]: deviceContentObj
            }
          }]
        }
      } else {
        // Device has no space id => Device is attached directly to newFloor
        newFloor['devices'] = {
          [device.controller_id]: deviceContentObj
        }
      }
      mappedAssetDevices.push(newFloor)
    }
  } else {
    // Device has no floor id => Device is attached directly to the building
    mappedBuildingDevices[device.controller_id] = deviceContentObj;
  }
}