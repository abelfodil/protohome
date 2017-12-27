import * as React              from 'react';
import Divider                 from 'material-ui/Divider';
import List, {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
}                              from 'material-ui/List';

import '../../Styles/Room.css';
import { ListRoomsProperties } from './Interfaces';
import AddRoom                 from './AddRoom';
import EditRoom                from './EditRoom';
import DeleteRoom              from './DeleteRoom';

export default class ListRooms extends React.Component<ListRoomsProperties, {}> {

    render() {
        return (
            <List>
                <ListItem>
                    <ListItemText primary="Rooms"/>
                    <Divider/>
                </ListItem>
                {
                    this.props.rooms.map(room => {
                        return (
                            <div>
                                <ListItem
                                    key={room.id + '_item'}
                                    button={true}
                                    onClick={() => this.props.selectRoom(room.id)}
                                >
                                    <ListItemText primary={room.name}/>
                                    <ListItemSecondaryAction>
                                        <EditRoom
                                            key={room.id + '_edit'}
                                            id={room.id}
                                            name={room.name}
                                            APILocation={this.props.APILocation}
                                            devices={room.devices}
                                            updateRoom={this.props.updateRoom}
                                        />

                                        <DeleteRoom
                                            key={room.id + '_delete'}
                                            id={room.id}
                                            name={room.name}
                                            APILocation={this.props.APILocation}
                                            devices={room.devices}
                                            deleteRoom={this.props.deleteRoom}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                            </div>
                        );
                    })
                }
                <ListItem key='new_room'>
                    <ListItemText primary="Add room"/>
                    <ListItemSecondaryAction>
                        <AddRoom
                            APILocation={this.props.APILocation}
                            addRoom={this.props.addRoom}
                        />
                    </ListItemSecondaryAction>
                </ListItem>

            </List>
        );
    }
}
