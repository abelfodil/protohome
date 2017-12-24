import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import DeleteForever from 'material-ui-icons/DeleteForever';

import GenericDialog from '../GenericDialog';
import { DeleteRoomProperties, DeleteRoomState } from './Interfaces';

export default class DeleteRoom extends GenericDialog<DeleteRoomProperties, DeleteRoomState> {

    actions = [
        (
            <FlatButton
                key="cancel"
                label="No"
                className="cancel"
                primary={true}
                onClick={this.closeDialog}
            />
        ),
        (
            <FlatButton
                key="delete"
                label="Yes"
                className="delete"
                primary={true}
                onClick={() => this.handleDelete()}
            />
        )
    ];

    constructor(props: DeleteRoomProperties) {
        super(props);
        this.state = {
            dialogIsOpen: false,
        };
    }

    handleDelete() {
        let location = this.props.backendLocation + '/rooms';

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let details = {
            headers: headers,
            method: 'DELETE',
            body: JSON.stringify({
                id: this.props.id
            })
        };

        fetch(location, details).then(() => {
            this.closeDialog();
            this.props.deleteRoom();
        });

    }

    render() {
        return (
            <span>
                <Dialog
                    title={'Deleting "' + this.props.name + '"'}
                    actions={this.actions}
                    modal={false}
                    open={this.state.dialogIsOpen}
                    onRequestClose={this.closeDialog}
                >
                    Do you really want to delete "{this.props.name}"?
                </Dialog>

                <IconButton
                    className="DeleteRoom"
                    onClick={this.openDialog}
                >
                    <DeleteForever/>
                </IconButton>

            </span>
        );
    }
}
