import * as React           from 'react';
import { MuiThemeProvider } from 'material-ui/styles';
import * as SocketIO        from 'socket.io-client';
import Drawer               from 'material-ui/Drawer';

import './Styles/App.css';
import { theme }            from './Styles/Theme';
import { AppState }         from './Components/Common/Interfaces';
import LoadingScreen        from './Components/Common/LoadingScreen';
import Room                 from './Components/Room/Room';
import ListRooms            from './Components/Room/ListRooms';
import { RoomAttributes }   from './Components/Room/Interfaces';

export default class App extends React.Component<{}, AppState> {
    private static host: string = 'http://localhost:5000';
    private socket: SocketIOClient.Socket;

    constructor(props: {}) {
        super(props);

        this.state = {
            rooms: [],
            selectedRoom: null,
            APILocation: App.host + '/api',
            loaded: false
        };

        this.fetchData();
    }

    handleRoomUpdate = (newRoom: RoomAttributes) => {
        let copiedApp = Object.assign({}, this.state);
        let copiedRooms: Array<RoomAttributes> = copiedApp.rooms;

        let roomIndex: number = copiedRooms.findIndex((room: RoomAttributes) => {
            return room.id === newRoom.id;
        });

        copiedRooms[roomIndex] = newRoom;

        this.setState({
            rooms: copiedRooms
        });

    }

    handleRoomDeletion = (roomId: string) => {
        let copiedApp = Object.assign({}, this.state);
        let copiedRooms: Array<RoomAttributes> = copiedApp.rooms;

        let roomIndex: number = copiedRooms.findIndex((room: RoomAttributes) => {
            return room.id === roomId;
        });

        copiedRooms.splice(roomIndex, 1);

        this.setState({
            rooms: copiedRooms
        });
    }

    handleRoomAddition = (newRoom: RoomAttributes) => {
        let copiedApp = Object.assign({}, this.state);
        let copiedRooms: Array<RoomAttributes> = copiedApp.rooms;

        copiedRooms.push(newRoom);

        this.setState({
            rooms: copiedRooms
        });
    }

    handleRoomSelection = (id: string) => {
        let roomIndex: number = this.state.rooms.findIndex((room: RoomAttributes) => {
            return room.id === id;
        });

        this.setState({
            selectedRoom: this.state.rooms[roomIndex]
        });
    }

    displaySelectedRoom = () => {
        if (this.state.selectedRoom === null) {
            if (this.state.rooms.length !== 0) {
                let room = this.state.rooms[0];
                return (
                    <Room
                        key={room.id + '_display'}
                        id={room.id}
                        name={room.name}
                        devices={room.devices}
                        APILocation={this.state.APILocation}
                        onRoomUpdate={this.handleRoomUpdate}
                    />
                );
            } else {
                return;
            }
        } else {
            return (
                <Room
                    key={this.state.selectedRoom.id + '_display'}
                    id={this.state.selectedRoom.id}
                    name={this.state.selectedRoom.name}
                    devices={this.state.selectedRoom.devices}
                    APILocation={this.state.APILocation}
                    onRoomUpdate={this.handleRoomUpdate}
                />
            );
        }
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
                <div className="App">
                    <Drawer
                        type="permanent"
                        anchor="left"
                        className="main-menu"
                    >
                        <ListRooms
                            APILocation={this.state.APILocation}
                            rooms={this.state.rooms}
                            updateRoom={this.handleRoomUpdate}
                            deleteRoom={this.handleRoomDeletion}
                            selectRoom={this.handleRoomSelection}
                            addRoom={this.handleRoomAddition}
                        />

                    </Drawer>
                    <main>
                        {this.displaySelectedRoom()}
                    </main>
                </div>
            );
        }

        return (
            <MuiThemeProvider theme={theme}>
                {objectToRender}
            </MuiThemeProvider>
        );
    }
}
