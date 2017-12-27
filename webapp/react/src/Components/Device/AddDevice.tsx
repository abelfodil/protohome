import * as React                                            from 'react';
import { ChangeEvent }                                       from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField                                             from 'material-ui/TextField';
import Select                                                from 'material-ui/Select';
import { MenuItem }                                          from 'material-ui/Menu';
import IconButton                                            from 'material-ui/IconButton';
import Add                                                   from 'material-ui-icons/Add';
import { FormControl, FormHelperText }                       from 'material-ui/Form';
import Input, { InputLabel }                                 from 'material-ui/Input';

import GenericDialog                                             from '../Common/GenericFormDialog';
import { AddDeviceProperties, AddDeviceState, DeviceAttributes } from './Interfaces';

export default class AddDevice extends GenericDialog<AddDeviceProperties, AddDeviceState> {

    constructor(props: AddDeviceProperties) {
        super(props);
        this.state = {
            dialogIsOpen: false,

            name: '',
            address: '',
            selectedCategory: '',
            helperName: '',
            helperAddress: '',
            helperCategory: '',

            errorName: false,
            errorAddress: false,
            errorCategory: false

        };
    }

    fieldsAreInvalid() {
        // TODO: refactor this
        let returnValue: boolean = false;

        if (this.state.name === '') {
            returnValue = true;
            this.setState({
                errorName: true,
                helperName: 'Required'
            });
        } else {
            this.setState({
                errorName: false,
                helperName: ''
            });
        }

        if (this.state.address === '') {
            returnValue = true;
            this.setState({
                errorAddress: true,
                helperAddress: 'Required'
            });
        } else {
            this.setState({
                errorAddress: false,
                helperAddress: ''
            });
        }

        if (this.state.selectedCategory === '') {
            returnValue = true;
            this.setState({
                errorCategory: true,
                helperCategory: 'Required'
            });
        } else {
            this.setState({
                errorCategory: false,
                helperCategory: ''
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

            helperName: '',
            helperAddress: '',
            helperCategory: '',

            errorName: false,
            errorAddress: false,
            errorCategory: false
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
                    this.setState({ helperName: 'Name already taken', errorName: true });
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
            <div className="dialogWrapper">
                <Dialog
                    open={this.state.dialogIsOpen}
                    onClose={this.closeDialog}
                    transition={this.transition}
                >
                    <DialogTitle>{'Adding a new device to "' + this.props.room_name + '"'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="name"
                            label="Name"
                            error={this.state.errorName}
                            helperText={this.state.helperName}
                            value={this.state.name}
                            onKeyPress={this.handleEnterKey}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                this.setState({
                                    name: event.target.value
                                });
                            }}
                            fullWidth
                            required
                        />

                        <br/>

                        <TextField
                            label="Address"
                            name="address"
                            error={this.state.errorAddress}
                            helperText={this.state.helperAddress}
                            value={this.state.address}
                            onKeyPress={this.handleEnterKey}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                this.setState({
                                    address: event.target.value
                                });
                            }}
                            fullWidth
                            required
                        />

                        <br/>

                        <FormControl>
                            <InputLabel htmlFor="category">Category</InputLabel>
                            <Select
                                value={this.state.selectedCategory}
                                input={<Input name="category" id="category"/>}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    this.setState({ selectedCategory: event.target.value });
                                }}
                                fullWidth
                            >
                                <MenuItem key="bulb" value="bulb">Lightbulb</MenuItem>
                                <MenuItem key="uk" value="uk">Unkown</MenuItem>
                            </Select>

                            <FormHelperText
                                error={this.state.errorCategory}
                            >
                                {this.state.helperCategory}
                            </FormHelperText>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        {this.cancelButton()}
                        {this.submitButton()}
                    </DialogActions>
                </Dialog>

                <IconButton
                    className="AddDevice"
                    onClick={this.openDialog}
                >
                    <Add/>
                </IconButton>
            </div>
        );
    }
}
