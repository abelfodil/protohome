import { DeviceAttributes } from '../Device/Interfaces';
import { GenericDialogState } from '../Interfaces';

export interface RoomAttributes {
    id: string;
    name: string;
    devices: Array<DeviceAttributes>;
}

export interface RoomProperties extends RoomAttributes {
    backendLocation: string;
    onRoomUpdate(newRoom: RoomAttributes): void;
    onRoomAdd(newRoom: RoomAttributes): void;
    onRoomDelete(id: string): void;
}

export interface AddRoomProperties {
    backendLocation: string;
    addRoom(newRoom: RoomAttributes): void;
}

export interface AddRoomState extends GenericDialogState {
    errorName: string;
    name: string;
}

export interface EditRoomProperties extends RoomAttributes {
    backendLocation: string;
    updateRoom(updatedRoom: RoomAttributes): void;
}

export interface EditRoomState extends GenericDialogState {
    errorName: string;
    name: string;
}

export interface DeleteRoomProperties extends RoomAttributes {
    backendLocation: string;
    deleteRoom(): void;
}

export interface DeleteRoomState extends GenericDialogState {
}
