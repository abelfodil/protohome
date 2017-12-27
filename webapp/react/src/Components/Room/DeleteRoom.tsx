import * as React                                                               from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle, DialogContentText } from 'material-ui/Dialog';
import IconButton                                                               from 'material-ui/IconButton';
import DeleteForever                                                            from 'material-ui-icons/DeleteForever';

import GenericDialog                             from '../Common/GenericFormDialog';
import { DeleteRoomProperties, DeleteRoomState } from './Interfaces';

export default class DeleteRoom extends GenericDialog<DeleteRoomProperties, DeleteRoomState> {

    constructor(props: DeleteRoomProperties) {
        super(props);
        this.state = {
            dialogIsOpen: false,
        };
    }

    handleConfirm = () => {
        let location = this.props.APILocation + '/rooms';

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
            <div className="dialogWrapper">
                <Dialog
                    open={this.state.dialogIsOpen}
                    onClose={this.closeDialog}
                >
                    <DialogTitle>{'Deleting "' + this.props.name + '"'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete "{this.props.name}"?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {this.cancelButton()}
                        {this.confirmButton()}
                    </DialogActions>
                </Dialog>

                <IconButton
                    className="DeleteRoom"
                    onClick={this.openDialog}
                >
                    <DeleteForever/>
                </IconButton>

            </div>
        );
    }
}
