import * as React       from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import '../../Styles/LoadingScreen.css';

export default class LoadingScreen extends React.Component {

    render() {
        return (
            <div className="LoadingScreen">
                <CircularProgress size={200} thickness={1}/>
            </div>
        );
    }
}
