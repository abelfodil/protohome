import * as React        from 'react';
import { KeyboardEvent } from 'react';
import Button            from 'material-ui/Button';
import Slide             from 'material-ui/transitions/Slide';
import { SlideProps }    from 'material-ui/transitions';

import { GenericDialogState } from './Interfaces';

export default abstract class GenericFormDialog<P, T extends GenericDialogState> extends React.Component<P, T> {
    constructor(props: P) {
        super(props);
    }

    transition(props: SlideProps) {
        return <Slide direction="down" {...props} />;
    }

    closeDialog = () => {
        this.setState({
            dialogIsOpen: false
        });
    }

    openDialog = () => {
        this.setState({
            dialogIsOpen: true
        });
    }

    handleSubmit = () => {
        return;
    }

    handleConfirm = () => {
        return;
    }

    handleEnterKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }

    cancelButton = () => {
        return (
            <Button
                key="cancel"
                className="cancel"
                onClick={this.closeDialog}
            >
                Cancel
            </Button>
        );
    }

    confirmButton = () => {
        return (
            <Button
                key="confirm"
                className="confirm"
                color="accent"
                onClick={this.handleConfirm}
            >
                Confirm
            </Button>
        );
    }

    submitButton = () => {
        return (
            <Button
                key="submit"
                className="submit"
                color="primary"
                onClick={this.handleSubmit}
            >
                Submit
            </Button>
        );
    }
}
