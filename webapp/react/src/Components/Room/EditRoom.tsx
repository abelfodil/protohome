import * as React                                            from 'react';
import { ChangeEvent }                                       from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField                                             from 'material-ui/TextField';
import Create                                                from 'material-ui-icons/Create';
import IconButton                                            from 'material-ui/IconButton';

import GenericDialog                                         from '../Common/GenericFormDialog';
import { EditRoomProperties, EditRoomState, RoomAttributes } from './Interfaces';

export default class EditRoom extends GenericDialog<EditRoomProperties, EditRoomState> {
    constructor(props: EditRoomProperties) {
        super(props);
        this.state = {
            dialogIsOpen: false,
            errorName: '',
            name: this.props.name
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
        headers.append('Content-Type', 'application/json');

        let details = {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify({
                id: this.props.id,
                name: this.state.name
            })
        };

        fetch(location, details).then(() => {
            let newRoom: RoomAttributes = {
                id: this.props.id,
                name: this.state.name,
                devices: this.props.devices
            };

            this.props.updateRoom(newRoom);

            this.setState({
                errorName: ''
            });

            this.closeDialog();
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
                    <DialogTitle>{'Editing "' + this.props.name + '"'}</DialogTitle>
                    <DialogContent>

                        <TextField
                            defaultValue={this.props.name}
                            name="name"
                            onKeyPress={this.handleEnterKey}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                this.setState({
                                    name: event.target.value
                                });
                            }}
                            fullWidth={true}
                        />

                    </DialogContent>

                    <DialogActions>
                        {this.cancelButton()}
                        {this.submitButton()}
                    </DialogActions>
                </Dialog>

                <IconButton
                    className="EditRoom"
                    onClick={this.openDialog}
                >
                    <Create/>
                </IconButton>
            </div>
        );
    }
}