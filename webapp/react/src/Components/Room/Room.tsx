import * as React                         from 'react';

import '../../Styles/Room.css';
import { DeviceAttributes }               from '../Device/Interfaces';
import { RoomAttributes, RoomProperties } from './Interfaces';
import Device                             from '../Device/Device';
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

    handleAddDevice = (newDevice: DeviceAttributes) => {
        let updatedRoom: RoomAttributes = Object.assign({}, this.props); // deep copy
        updatedRoom.devices.push(newDevice);

        this.props.onRoomUpdate(updatedRoom);
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
                    APILocation={this.props.APILocation}
                    onDeviceChange={this.handleDeviceChange}
                />
            );
        });

        return (
            <div className={'Room'}>

                <h1>{this.props.name}</h1>

                <span className="buttons">

                </span>

                <div>
                    {devices}

                    <AddDevice
                        key={this.props.id + '_add'}
                        room_id={this.props.id}
                        room_name={this.props.name}
                        APILocation={this.props.APILocation}
                        addDevice={this.handleAddDevice}
                    />
                </div>

            </div>
        );
    }
}
