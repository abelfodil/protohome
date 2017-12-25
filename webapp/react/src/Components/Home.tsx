import * as React from 'react';

import '../Styles/Home.css';

import Room    from './Room/Room';
import AddRoom from './Room/AddRoom';

import { RoomAttributes }                 from './Room/Interfaces';
import { HomeAttributes, HomeProperties } from './Interfaces';

export default class Home extends React.Component<HomeProperties, HomeAttributes> {

    constructor(props: HomeProperties) {
        super(props);
        this.state = props;
    }

    componentWillReceiveProps(nextProps: HomeAttributes) {
        if (this.props !== nextProps) {
            this.setState({
                rooms: nextProps.rooms
            });
        }
    }

    handleRoomUpdate = (newRoom: RoomAttributes) => {
        let copiedHome: HomeAttributes = Object.assign({}, this.state); // deep copy
        let copiedRooms: Array<RoomAttributes> = copiedHome.rooms;

        let roomIndex: number = copiedRooms.findIndex((room: RoomAttributes) => {
            return room.id === newRoom.id;
        });

        copiedRooms[roomIndex] = newRoom;

        this.setState({
            rooms: copiedRooms
        });

    }

    handleRoomDeletion = (roomId: string) => {
        let copiedHome: HomeAttributes = Object.assign({}, this.state); // deep copy
        let copiedRooms: Array<RoomAttributes> = copiedHome.rooms;

        let roomIndex: number = copiedRooms.findIndex((room: RoomAttributes) => {
            return room.id === roomId;
        });

        copiedRooms.splice(roomIndex, 1);

        this.setState({
            rooms: copiedRooms
        });
    }

    handleRoomAddition = (newRoom: RoomAttributes) => {
        let copiedHome: HomeAttributes = Object.assign({}, this.state); // deep copy
        let copiedRooms: Array<RoomAttributes> = copiedHome.rooms;

        copiedRooms.push(newRoom);

        this.setState({
            rooms: copiedRooms
        });
    }

    render() {
        let rooms = this.state.rooms.map(room => {
            return (
                <Room
                    key={room.id}
                    id={room.id}
                    name={room.name}
                    devices={room.devices}
                    backendLocation={this.props.backendLocation}
                    onRoomDelete={this.handleRoomDeletion}
                    onRoomAdd={this.handleRoomAddition}
                    onRoomUpdate={this.handleRoomUpdate}
                />
            );
        });

        return (
            <div className="Home">
                {rooms}
                <AddRoom
                    backendLocation={this.props.backendLocation}
                    addRoom={this.handleRoomAddition}
                />

            </div>
        );
    }
}
