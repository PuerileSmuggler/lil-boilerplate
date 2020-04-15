import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
root: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
},

textField: {
    maxWidth: '400px'
}
});

export default useStyles;