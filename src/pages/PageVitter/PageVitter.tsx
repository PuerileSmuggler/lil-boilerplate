import React, { useState } from 'react';
import useStyles from './PageVitterStyles';
import { TextField, Button } from '@material-ui/core';
import vitterEncode from '../../utils/vitter';

interface PropsType {}

const PageVitter: React.FunctionComponent<PropsType> = () => {
    const classes = useStyles();

    const [input, setInput] = useState<string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onInputChange = (event: any): void => {
        setInput(event.target.value);
    }

    const onClick = (): void => {
        if (input) {
            vitterEncode(input);
        }
    }
    return (
        <div className={classes.root}>
            <TextField className={classes.textField} variant='outlined' label='Word to encode' onChange={onInputChange}/>
            <TextField className={classes.textField} disabled />
            <Button onClick={onClick}>
                Hej hej
            </Button>
        </div>
    )
}

export default PageVitter;