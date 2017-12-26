import { RoomAttributes } from '../Room/Interfaces';

export interface HomeAttributes {
    rooms: Array<RoomAttributes>;
}

export interface HomeProperties extends HomeAttributes {
    APILocation: string;
}

export interface AppState {
    rooms: Array<RoomAttributes>;
    APILocation: string;
    loaded: boolean;
}

export interface GenericDialogState {
    dialogIsOpen: boolean;
}