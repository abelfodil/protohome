import * as React from 'react';

import LightbulbOutline from 'material-ui-icons/LightbulbOutline';
import Warning          from 'material-ui-icons/Warning';

export default class DeviceIcon extends React.Component<{ category: string }, {}> {

    render() {
        switch (this.props.category) {
            case 'bulb':
                return <LightbulbOutline/>;
            default:
                return <Warning/>;
        }
    }
}
