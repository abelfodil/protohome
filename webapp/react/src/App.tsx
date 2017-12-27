import * as React    from 'react';
import * as SocketIO from 'socket.io-client';

import './Styles/App.css';
import { AppState }  from './Components/Common/Interfaces';
import Home          from './Components/Home';
import LoadingScreen from './Components/Common/LoadingScreen';

export default class App extends React.Component<{}, AppState> {
    private static host: string = 'http://localhost:5000';
    private socket: SocketIOClient.Socket;

    constructor(props: {}) {
        super(props);

        this.state = {
            rooms: [],
            APILocation: App.host + '/api',
            loaded: false
        };

        this.fetchData();
    }

    fetchData() {
        fetch(this.state.APILocation + '/rooms').then(response => {
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
        this.socket = SocketIO.connect(this.state.APILocation + '/socket');
        this.socket.on('notify', () => {
            this.fetchData();
        });
    }

    componentWillUnmount() {
        this.socket.close();
    }

    render() {
        let objectToRender = (<LoadingScreen/>);

        if (this.state.loaded) {
            objectToRender = (
                <Home
                    APILocation={this.state.APILocation}
                    rooms={this.state.rooms}
                />
            );
        }

        return (
            <div className="App">
                {objectToRender}
            </div>
        );
    }
}
