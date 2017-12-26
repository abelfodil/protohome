import { DeviceAttributes }   from '../Device/Interfaces';
import { GenericDialogState } from '../Common/Interfaces';

export interface RoomAttributes {
    id: string;
    name: string;
    devices: Array<DeviceAttributes>;
}

export interface RoomProperties extends RoomAttributes {
    APILocation: string;
    onRoomUpdate(newRoom: RoomAttributes): void;
    onRoomAdd(newRoom: RoomAttributes): void;
    onRoomDelete(id: string): void;
}

export interface AddRoomProperties {
    APILocation: string;
    addRoom(newRoom: RoomAttributes): void;
}

export interface AddRoomState extends GenericDialogState {
    errorName: string;
    name: string;
}

export interface EditRoomProperties extends RoomAttributes {
    APILocation: string;
    updateRoom(updatedRoom: RoomAttributes): void;
}

export interface EditRoomState extends GenericDialogState {
    errorName: string;
    name: string;
}

export interface DeleteRoomProperties extends RoomAttributes {
    APILocation: string;
    deleteRoom(): void;
}

export interface DeleteRoomState extends GenericDialogState {
}
