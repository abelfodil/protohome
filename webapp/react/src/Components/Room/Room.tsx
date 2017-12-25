import * as React                         from 'react';

import '../../Styles/Room.css';
import { DeviceAttributes }               from '../Device/Interfaces';
import { RoomAttributes, RoomProperties } from './Interfaces';
import Device                             from '../Device/Device';
import EditRoom                           from './EditRoom';
import DeleteRoom                         from './DeleteRoom';
import AddDevice                          from '../Device/AddDevice';

export default class Room extends React.Component<RoomProperties, {}> {

    handleDeviceChange = (newDevice: DeviceAttributes) => {
        let updatedRoom: RoomAttributes = Object.assign({}, this.props); // deep copy

        let deviceIndex: number = updatedRoom.devices.findIndex((device: DeviceAttributes) => {
            return device.name === newDevice.name;
        });

        updatedRoom.devices[deviceIndex] = newDevice;
        this.props.onRoomUpdate(updatedRoom);
    }

    handleUpdate = (updatedRoom: RoomAttributes) => {
        this.props.onRoomUpdate(updatedRoom);
    }

    handleAddDevice = (newDevice: DeviceAttributes) => {
        let updatedRoom: RoomAttributes = Object.assign({}, this.props); // deep copy
        updatedRoom.devices.push(newDevice);

        this.props.onRoomUpdate(updatedRoom);
    }

    handleDeleteRoom = () => {
        this.props.onRoomDelete(this.props.id);
    }

    render() {
        let devices = this.props.devices.map((device: DeviceAttributes) => {
            return (
                <Device
                    key={device.id}
                    id={device.id}
                    name={device.name}
                    category={device.category}
                    state={device.state}
                    room={this.props.id}
                    backendLocation={this.props.backendLocation}
                    onDeviceChange={this.handleDeviceChange}
                />
            );
        });

        return (
            <div className={'Room'}>

                <h1>{this.props.name}</h1>

                <span className="buttons">
                    <EditRoom
                        key={this.props.id + '_edit'}
                        id={this.props.id}
                        name={this.props.name}
                        backendLocation={this.props.backendLocation}
                        devices={this.props.devices}
                        updateRoom={this.handleUpdate}
                    />

                    <DeleteRoom
                        key={this.props.id + '_delete'}
                        id={this.props.id}
                        name={this.props.name}
                        backendLocation={this.props.backendLocation}
                        devices={this.props.devices}
                        deleteRoom={this.handleDeleteRoom}
                    />
                </span>

                <div>
                    {devices}

                    <AddDevice
                        key={this.props.id + '_add'}
                        room_id={this.props.id}
                        room_name={this.props.name}
                        backendLocation={this.props.backendLocation}
                        addDevice={this.handleAddDevice}
                    />
                </div>

            </div>
        );
    }
}
