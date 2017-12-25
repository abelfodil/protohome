import * as React             from 'react';
import { GenericDialogState } from './Interfaces';

export default abstract class GenericDialog<P, T extends GenericDialogState> extends React.Component<P, T> {
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
}
