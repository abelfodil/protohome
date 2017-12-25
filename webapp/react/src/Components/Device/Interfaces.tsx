import { GenericDialogState } from '../Interfaces';

export interface DeviceAttributes {
    id: string;
    name: string;
    category: string;
    state: string;
    room: string;
}

export interface DeviceProperties extends DeviceAttributes {
    backendLocation: string;
    onDeviceChange(newDevice: DeviceAttributes): void;
}

export interface DeviceDialogProperties {
    room_id: string;
    room_name: string;
    backendLocation: string;
}

export interface AddDeviceProperties extends DeviceDialogProperties {
    addDevice(newDevice: DeviceAttributes): void;
}

export interface AddDeviceState extends GenericDialogState {
    name: string;
    address: string;
    selectedCategory: string;

    errorName: string;
    errorAddress: string;
    errorCategory: string;
}
