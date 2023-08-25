import React, { useEffect, useState } from "react"
import { Row, Col, Card, Button } from "reactstrap"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

// import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
// import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
// import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import "toastr/build/toastr.min.css"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        //   padding: theme.spacing(1, 2),
    },
    list: {
        width: '100%',
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

function not(a, b) {
    return a.filter((value) => {
        return b.findIndex(value2 => value2.id === value.id) === -1;
    });
}

function intersection(a, b) {
    return a.filter((value) => {
        return b.findIndex(value2 => value2.id === value.id) !== -1;
    });
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

const DevicesList = (props) => {
    const classes = useStyles();
    const [controllers, setControllers] = useState([])
    const [selectedDevices, setSelectedDevices] = useState([])
    const [checked, setChecked] = useState([])

    useEffect(() => {
        setSelectedDevices(props.selectedDevices);
        setControllers(props.controllers);
    }, [props.selectedDevices.length, props.controllers.length])

    const leftChecked = intersection(checked, controllers);
    const rightChecked = intersection(checked, selectedDevices);

    const handleToggle = (value) => () => {
        const currentIndex = checked.findIndex(i => i.id === value.id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setSelectedDevices(selectedDevices.concat(leftChecked));
        setControllers(not(controllers, leftChecked));
        setChecked(not(checked, leftChecked));
        props.handleSelected(leftChecked);
    };

    const handleCheckedLeft = () => {
        setControllers(controllers.concat(rightChecked));
        setSelectedDevices(not(selectedDevices, rightChecked));
        setChecked(not(checked, rightChecked));
        props.handleRemoved(rightChecked);
    };

    const customList = (title, items) => {
        let itemList = items.filter(i => !(typeof i.hide !== "undefined" && i.hide))

        return (
            <Card>
                <CardHeader
                    className={classes.cardHeader}
                    avatar={
                        <Checkbox
                            onClick={handleToggleAll(itemList)}
                            checked={numberOfChecked(itemList) === itemList.length && itemList.length !== 0}
                            indeterminate={numberOfChecked(itemList) !== itemList.length && numberOfChecked(itemList) !== 0}
                            disabled={itemList.length === 0}
                            inputProps={{ 'aria-label': 'all items selected' }}
                        />
                    }
                    title={title}
                    subheader={`${numberOfChecked(itemList)}/${itemList.length} selected`}
                />
                <Divider />

                {props.customComponent && title == 'All devices' ? props.customComponent :  <div style={{ height: '50px' }}></div>} 

                <List className={classes.list} dense component="div" role="list">
                    {itemList.map((value, idx) => {
                        const labelId = `transfer-list-all-item-${value.id}-label`;
                        const isChecked = checked.length ? checked.filter(i => i.id === value.id).length ? true : false : false;
                        const roomName = getRoomName(value.room_id)

                        return (
                            <ListItem key={idx} role="listitem" button onClick={handleToggle(value)}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={isChecked}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={<span>{roomName ? '< ' + roomName + ' >' + ' - ' : ''} <strong>{value.name}</strong></span>} />
                            </ListItem>
                        );
                    })}
                    <ListItem />
                </List>
            </Card>
        )
    };

    function getRoomName(roomId) {
        if (props.roomList) {
            if (roomId) {
                const rooms = [...props.roomList]
                const room = rooms.find(r => r.id === roomId)
                return typeof room !== "undefined" ? room.name : ''
            }
            return ''
        }

        return ''
    }

    return (

        <Row>
            <Col>
                <div className="mt-4">
                    {/* <AvForm className="needs-validation" onValidSubmit={(e, v) => {
                        console.log(e, v)
                        // handleValidSubmit(e, v) 
                    }}> */}
                        <div className="mb-3">
                            <Grid container spacing={1} justifyContent="center" alignItems="center" className={classes.root} style={{flexWrap: 'nowrap'}}>
                                <Grid item className="all-items">{customList('All devices', controllers)} </Grid>
                              

                                <Grid item className="grid-move-btn-content">
                                    <Grid container direction="column" alignItems="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            className={classes.button}
                                            onClick={handleCheckedRight}
                                            disabled={leftChecked.length === 0}
                                            aria-label="move selected right"
                                        >
                                            &gt;
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            className={classes.button}
                                            onClick={handleCheckedLeft}
                                            disabled={rightChecked.length === 0}
                                            aria-label="move selected left"
                                        >
                                            &lt;
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item className="selected-items">{customList('Selected devices', selectedDevices)}</Grid>
                            </Grid>
                        </div>
                        {/* <div className="mt-4 float-end">
                            <Button
                                type="submit"
                                color="primary"
                                className="w-md ms-2"
                                disabled={false}
                            >Submit</Button>
                        </div> */}
                    {/* </AvForm> */}
                </div>
            </Col>
        </Row>

    )
}

DevicesList.propTypes = {

}

export default DevicesList;
