import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textField: {
    width: '60%',
    margin: '12px !important'
  },
  diagramComponent: {
    flexGrow: 1,
    width: '100%',
    border: 'solid 1px black',
    backgroundColor: 'white',
  },
  hideDisplay: {
      display: 'none'
  }
});

export default useStyles;
