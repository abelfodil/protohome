import { GenericDialogState } from '../Common/Interfaces';

export interface DeviceAttributes {
    id: string;
    name: string;
    category: string;
    state: string;
    room: string;
}

export interface DeviceProperties extends DeviceAttributes {
    APILocation: string;
    onDeviceChange(newDevice: DeviceAttributes): void;
}

export interface DeviceDialogProperties {
    room_id: string;
    room_name: string;
    APILocation: string;
}

export interface AddDeviceProperties extends DeviceDialogProperties {
    addDevice(newDevice: DeviceAttributes): void;
}

export interface AddDeviceState extends GenericDialogState {
    name: string;
    address: string;
    selectedCategory: string;

    helperName: string;
    helperAddress: string;
    helperCategory: string;

    errorName: boolean;
    errorAddress: boolean;
    errorCategory: boolean;
}
