import * as React        from 'react';
import { KeyboardEvent } from 'react';

import { GenericDialogState } from './Interfaces';

export default abstract class GenericFormDialog<P, T extends GenericDialogState> extends React.Component<P, T> {
    constructor(props: P) {
        super(props);
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

    handleEnterKey = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }
}
