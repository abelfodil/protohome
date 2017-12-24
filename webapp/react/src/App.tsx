import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './Styles/App.css';
import { AppProperties } from './Components/Interfaces';
import Home from './Components/Home';
import LoadingScreen from './Components/LoadingScreen';

export default class App extends React.Component<{}, AppProperties> {
    private timer: NodeJS.Timer;

    constructor(props: {}) {
        super(props);

        this.state = {
            rooms: [],
            backendLocation: 'http://localhost:5000/api',
            loaded: false
        };

        this.fetchData();
    }

    fetchData() {
        fetch(this.state.backendLocation + '/rooms').then(response => {
            response.json().then(data => {
                this.setState({
                    rooms: data,
                    loaded: true
                });
            });
        }).catch(
            () => {
                console.log('Failed to communicate with server');
            }
        );
    }

    componentDidMount() {
        this.timer = global.setInterval(() => this.fetchData(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        let objectToRender = (<LoadingScreen/>);

        if (this.state.loaded) {
            objectToRender = (
                <Home
                    backendLocation={this.state.backendLocation}
                    rooms={this.state.rooms}
                />
            );
        }

        return (
            <MuiThemeProvider>
                <div className="App">
                    {objectToRender}
                </div>
            </MuiThemeProvider>
        );
    }
}
