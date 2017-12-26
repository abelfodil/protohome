import * as React  from 'react';
import Dialog      from 'material-ui/Dialog';
import FlatButton  from 'material-ui/FlatButton';
import TextField   from 'material-ui/TextField';
import Divider     from 'material-ui/Divider';
import IconButton  from 'material-ui/IconButton';
import BorderInner from 'material-ui-icons/BorderInner';

import GenericDialog                                       from '../Common/GenericFormDialog';
import { AddRoomProperties, AddRoomState, RoomAttributes } from './Interfaces';
import { InputFieldStyles }                                from '../../Styles/Styles';

export default class AddRoom extends GenericDialog<AddRoomProperties, AddRoomState> {

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
            <span>
                <Dialog
                    title={'Adding a new room'}
                    actions={this.actions}
                    modal={false}
                    open={this.state.dialogIsOpen}
                    onRequestClose={this.closeDialog}
                >
                    <TextField
                        style={InputFieldStyles}
                        hintText="Name"
                        name="name"
                        errorText={this.state.errorName}
                        underlineShow={false}
                        onKeyPress={this.handleEnterKey}
                        onChange={(event: object, value: string) => {
                            this.setState({
                                name: value
                            });
                        }}
                    />
                    <Divider/>

                </Dialog>

                <IconButton
                    className="AddRoom"
                    onClick={this.openDialog}
                >
                    <BorderInner/>
                </IconButton>
            </span>
        );
    }
}