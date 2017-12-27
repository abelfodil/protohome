import * as React                             from 'react';
import IconButton                             from 'material-ui/IconButton';

import '../../Styles/Device.css';
import DeviceIcon                             from './DeviceIcon';
import { DeviceProperties, DeviceAttributes } from './Interfaces';

export default class Device extends React.Component<DeviceProperties, {}> {

    handleStateUpdate = (state: string) => {
        let newDevice: DeviceAttributes = Object.assign({}, this.props); // deep copy
        newDevice.state = state;

        this.props.onDeviceChange(newDevice);
    }

    sendCommand = () => {
        let location: string = this.props.APILocation + '/command';

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        let details = {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify({
                id: this.props.id,
                room: this.props.room,
                command: 'toggle'
            })
        };

        fetch(location, details).then(result => {
            result.json().then(data => {
                this.handleStateUpdate(data.state);
            });
        });
    }

    render() {
        return (
            <IconButton
                className={'DeviceButton ' + this.props.state}
                onClick={this.sendCommand}
                disableRipple
            >
                <DeviceIcon category={this.props.category}/>
            </IconButton>
        );
    }
}
