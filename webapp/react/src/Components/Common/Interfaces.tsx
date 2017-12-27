import { RoomAttributes } from '../Room/Interfaces';

export interface AppState {
    rooms: Array<RoomAttributes>;
    selectedRoom: RoomAttributes | null;
    APILocation: string;
    loaded: boolean;
}

export interface GenericDialogState {
    dialogIsOpen: boolean;
}