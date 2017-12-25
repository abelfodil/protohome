import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Create from 'material-ui-icons/Create';
import IconButton from 'material-ui/IconButton';

import GenericDialog from '../GenericDialog';
import { EditRoomProperties, EditRoomState, RoomAttributes } from './Interfaces';
import { InputFieldStyles } from '../../Styles/Styles';

export default class EditRoom extends GenericDialog<EditRoomProperties, EditRoomState> {

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
                label="Submit"
                className="submit"
                primary={true}
                onClick={() => this.handleSubmit()}
            />
        )
    ];

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

    handleSubmit() {
        if (this.fieldsAreInvalid()) {
            return;
        }

        let location: string = this.props.backendLocation + '/rooms';

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
            <span>
                <Dialog
                    title={'Editing "' + this.props.name + '"'}
                    actions={this.actions}
                    modal={false}
                    open={this.state.dialogIsOpen}
                    onRequestClose={this.closeDialog}
                >
                    <TextField
                        style={InputFieldStyles}
                        defaultValue={this.props.name}
                        name="name"
                        errorText={this.state.errorName}
                        onChange={(event: object, value: string) => {
                            this.setState({
                                name: value
                            });
                        }}
                    />

                </Dialog>

                <IconButton
                    className="EditRoom"
                    onClick={this.openDialog}
                >
                    <Create/>
                </IconButton>
            </span>
        );
    }
}