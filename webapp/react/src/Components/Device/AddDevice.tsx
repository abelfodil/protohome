import * as React  from 'react';
import Dialog      from 'material-ui/Dialog';
import FlatButton  from 'material-ui/FlatButton';
import TextField   from 'material-ui/TextField';
import Divider     from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';
import IconButton  from 'material-ui/IconButton';
import Add         from 'material-ui-icons/Add';

import GenericDialog                                             from '../Common/GenericFormDialog';
import { AddDeviceProperties, AddDeviceState, DeviceAttributes } from './Interfaces';
import { InputFieldStyles }                                      from '../../Styles/Styles';

export default class AddDevice extends GenericDialog<AddDeviceProperties, AddDeviceState> {

    actions = [
        (
            <FlatButton
                key="cancel"
                label="Cancel"
                className="cancel"
                primary={true}
                onClick={this.closeDialog}
            />
        ),
        (
            <FlatButton
                key="submit"
                label="Add"
                className="submit"
                primary={true}
                onClick={() => this.handleSubmit()}
            />
        )
    ];

    categoryItems = [
        <MenuItem key="bulb" value="bulb" primaryText="Lightbulb"/>,
        <MenuItem key="uk" value="uk" primaryText="Unkown"/>,
    ];

    constructor(props: AddDeviceProperties) {
        super(props);
        this.state = {
            dialogIsOpen: false,

            name: '',
            address: '',
            selectedCategory: '',

            errorName: '',
            errorAddress: '',
            errorCategory: ''
        };
    }

    fieldsAreInvalid() {
        // TODO: refactor this
        let returnValue: boolean = false;

        if (this.state.name === '') {
            returnValue = true;
            this.setState({
                errorName: 'Required'
            });
        } else {
            this.setState({
                errorName: ''
            });
        }

        if (this.state.address === '') {
            returnValue = true;
            this.setState({
                errorAddress: 'Required'
            });
        } else {
            this.setState({
                errorAddress: ''
            });
        }

        if (this.state.selectedCategory === '') {
            returnValue = true;
            this.setState({
                errorCategory: 'Required'
            });
        } else {
            this.setState({
                errorCategory: ''
            });
        }

        return returnValue;
    }

    resetState() {
        this.setState({
            dialogIsOpen: false,

            name: '',
            address: '',
            selectedCategory: '',

            errorName: '',
            errorAddress: '',
            errorCategory: ''
        });
    }

    handleSubmit = () => {
        if (this.fieldsAreInvalid()) {
            return;
        }

        let location: string = this.props.APILocation + '/devices';

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        let details = {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({
                room: this.props.room_id,
                name: this.state.name,
                address: this.state.address,
                category: this.state.selectedCategory
            })
        };

        fetch(location, details).then(result => {
            result.json().then(data => {
                if (data.duplicate) {
                    this.setState({ errorName: 'Name already taken' });
                } else {

                    let newDevice: DeviceAttributes = {
                        id: data.id,
                        name: this.state.name,
                        category: this.state.selectedCategory,
                        state: 'off',
                        room: this.props.room_id
                    };

                    this.props.addDevice(newDevice);

                    this.resetState();
                    this.closeDialog();
                }
            });
        });
    }

    render() {
        return (
            <span>
                <Dialog
                    title={'Adding a new device to "' + this.props.room_name + '"'}
                    actions={this.actions}
                    modal={false}
                    open={this.state.dialogIsOpen}
                    onRequestClose={this.closeDialog}
                >
                    <TextField
                        style={InputFieldStyles}
                        hintText="Name"
                        name="name"
                        value={this.state.name}
                        underlineShow={false}
                        errorText={this.state.errorName}
                        onKeyPress={this.handleEnterKey}
                        onChange={(event: object, value: string) => {
                            this.setState({
                                name: value
                            });
                        }}
                    />
                    <Divider/>
                    <TextField
                        style={InputFieldStyles}
                        hintText="Address"
                        name="address"
                        value={this.state.address}
                        underlineShow={false}
                        errorText={this.state.errorAddress}
                        onKeyPress={this.handleEnterKey}
                        onChange={(event: object, value: string) => {
                            this.setState({
                                address: value
                            });
                        }}
                    />
                    <Divider/>
                    <SelectField
                        style={InputFieldStyles}
                        value={this.state.selectedCategory}
                        name="category"
                        onChange={(event, index, category) => {
                            this.setState({ selectedCategory: category });
                        }}
                        floatingLabelText="Category"
                        errorText={this.state.errorCategory}
                    >
                        {this.categoryItems}
                    </SelectField>

                    <Divider/>
                </Dialog>

                <IconButton
                    className="AddDevice"
                    onClick={this.openDialog}
                >
                    <Add/>
                </IconButton>
            </span>
        );
    }
}
