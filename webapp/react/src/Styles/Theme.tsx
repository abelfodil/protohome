import { createMuiTheme } from 'material-ui/styles';
import { cyan, red }      from 'material-ui/colors';

export const theme = createMuiTheme({
    typography: {
        // Use the system font.
        fontFamily:
        '-apple-system,system-ui,BlinkMacSystemFont,' +
        '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    },
    palette: {
        type: 'dark',
        primary: cyan,
        secondary: red,
        error: red,
    },
});
