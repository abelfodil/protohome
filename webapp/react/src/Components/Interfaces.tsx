import { RoomAttributes } from './Room/Interfaces';

export interface HomeAttributes {
    rooms: Array<RoomAttributes>;
}

export interface HomeProperties extends HomeAttributes {
    backendLocation: string;
}

export interface AppProperties {
    rooms: Array<RoomAttributes>;
    backendLocation: string;
    loaded: boolean;
}

export interface GenericDialogState {
    dialogIsOpen: boolean;
}