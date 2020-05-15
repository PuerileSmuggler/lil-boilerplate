import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button } from '@material-ui/core';
import { chunkBytes } from '../utils/utils';
import Hamming from '../utils/hamming';


const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column'
    }
});

const ParityPage = (): JSX.Element => {

const classes= useStyles();

const [input, setInput] = useState<string>('');

const setParityBytes = (): string[] | null => {
    if(input) {
        const test = new Hamming(input);
        test.setParityBytesCount()
        test.setParityBytes();
        test.randomDataError();
        test.setParityBytes(true);
        const byteArray = chunkBytes(input);
        const parityByteArray = byteArray.map(byteCode => {
            const isParity = byteCode.split('').reduce((prevValue, currentValue) => {
                return currentValue === '1' ? !prevValue : prevValue;
            }, true)
            return isParity ? byteCode = '1' + byteCode :  byteCode = '0' + byteCode;
        });
        return parityByteArray;
    }
    return null;
}
    
    return (
        <div className={classes.root}>
            <TextField value={input} onChange={(event): void => setInput(event.target.value)} label="Input text" variant="outlined"/>
            {input}
            <Button onClick={setParityBytes}>hej hej</Button>
        </div>
    );
}

export default ParityPage;