import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textField: {
    width: '60%',
    margin: '12px !important',
  },
  diagramComponent: {
    flexGrow: 1,
    width: '100%',
    border: 'solid 1px black',
    backgroundColor: 'white',
    minHeight: '800px'
  },
  hideDisplay: {
      display: 'none'
  },
  controls: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  }
});

export default useStyles;
