import * as React                                            from 'react';
import { ChangeEvent }                                       from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField                                             from 'material-ui/TextField';
import IconButton                                            from 'material-ui/IconButton';
import BorderInner                                           from 'material-ui-icons/BorderInner';

import GenericDialog                                       from '../Common/GenericFormDialog';
import { AddRoomProperties, AddRoomState, RoomAttributes } from './Interfaces';

export default class AddRoom extends GenericDialog<AddRoomProperties, AddRoomState> {
    constructor(props: AddRoomProperties) {
        super(props);
        this.state = {
            dialogIsOpen: false,
            name: '',
            errorName: ''
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

        return returnValue;
    }

    handleSubmit = () => {
        if (this.fieldsAreInvalid()) {
            return;
        }

        let location: string = this.props.APILocation + '/rooms';

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        let details = {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name
            })
        };

        fetch(location, details).then(result => {
            result.json().then(data => {
                let newRoom: RoomAttributes = {
                    id: data.id,
                    name: this.state.name,
                    devices: []
                };

                this.props.addRoom(newRoom);

                this.setState({
                    name: '',
                    errorName: ''
                });

                this.closeDialog();
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
                    <DialogTitle>Adding a new room</DialogTitle>
                    <DialogContent>

                        <TextField
                            name="name"
                            label="Name"
                            onKeyPress={this.handleEnterKey}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                this.setState({
                                    name: event.target.value
                                });
                            }}
                            fullWidth
                            required
                        />

                    </DialogContent>

                    <DialogActions>
                        {this.cancelButton()}
                        {this.submitButton()}
                    </DialogActions>
                </Dialog>

                <IconButton
                    className="AddRoom"
                    onClick={this.openDialog}
                >
                    <BorderInner/>
                </IconButton>
            </div>
        );
    }
}