import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Select, MenuItem, TextareaAutosize } from '@material-ui/core';
import { chunkBytes } from '../utils/utils';
import Hamming from '../utils/hamming';
import CRC, { CrcTypesEnum } from '../utils/CRC';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const ParityPage = (): JSX.Element => {
  const classes = useStyles();

  const [input, setInput] = useState<string>('');

  const [type, setType] = useState(CrcTypesEnum.CRC16);

  const [crcCodeEncode, setCrcCodeEncode] = useState('');

  const [byteCode, setByteCode] = useState('');

  const [hammingCode, setHammingCode] = useState('');

  const [coloredBits, setColoredBits] = useState<JSX.Element[]>();

  const [errorBitsElements, setErrorBitsElements] = useState<JSX.Element[]>();

  const [errorBitsCode, setErrorBitsCode] = useState('');

  const [erroneusBit, setErroneusBit] = useState(0);

  const [crcValid, setCrcValid] = useState<boolean>();

  const [error1, setError1] = useState(-1);
  const [error2, setError2] = useState(-1);
  const [error3, setError3] = useState(-1);

  const setParityBytes = (): string[] | null => {
    if (input) {
      // const test = new Hamming(input);
      // test.setParityBytesCount()
      // test.setParityBytes();
      // test.randomDataError();
      // test.setParityBytes(true);
      const test = new CRC();
      const byteArray = chunkBytes(input);
      const parityByteArray = byteArray.map(byteCode => {
        const isParity = byteCode
          .split('')
          .reduce((prevValue, currentValue) => {
            return currentValue === '1' ? !prevValue : prevValue;
          }, true);
        return isParity
          ? (byteCode = '1' + byteCode)
          : (byteCode = '0' + byteCode);
      });
      return parityByteArray;
    }
    return null;
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ): void => {
    setType(event.target.value as CrcTypesEnum);
  };

  const setCRC = (): void => {
      const crc = new CRC();
      const bitInput = chunkBytes(input).join('');
      crc.encode(bitInput, type);
      setByteCode(bitInput);
      setCrcCodeEncode(crc.CRCRemainderEncode);
  }

  const decodeCRC = (): void => {
    const crc = new CRC();
    const hamming = new Hamming(errorBitsCode);
    setCrcValid(crc.decode(hamming.removeHammingBits(), type));
  }

  const colorBits = (codeHamming: string, code: string, codeCRC: string): JSX.Element[] => {
      const hammingArray = codeHamming.split('');
      const byteCodeArray = code.split('').reverse();
      const crcArray = codeCRC.split('').reverse();
      const errorArray = [error1, error2, error3];
      let pow = 0;
      let count= 0;
      const coloredElementsArray = hammingArray.map((bit, index) => {
        if((index + 1) === Math.pow(2,pow)) {
          pow++;
          return (<span style={{color: 'green', fontWeight: 'bold'}} key={`hamming-${index}`}>{bit}</span>)
        }
        const temp = count;
        if (count < crcArray.length) {
          count++;
          return (<span style={{color: 'blue', fontWeight: 'bold'}} key={`crc-${index}`}>{crcArray[temp]}</span>)
        }
        count++;
        return (<span key={`code-${index}`}>{byteCodeArray[temp - crcArray.length]}</span>)
      });
      errorArray.forEach((index) => {
        if(index > 0 && index <= coloredElementsArray.length) {
          coloredElementsArray[index - 1] = (<span style={{color: 'red', fontWeight: 'bold'}} key={`error-${index}`}>{hammingArray[index - 1]}</span>)
        }
      });
      return coloredElementsArray.reverse();
  }

  const setHamming = (): void => {
      const test = new Hamming(`${byteCode}${crcCodeEncode}`);
      test.setParityBytesCount(false);
      test.setParityBytes();
      setHammingCode(test.byteCodeReverse);
      setColoredBits(colorBits(test.byteCodeReverse, byteCode, crcCodeEncode));
  }

  const decodeHamming = (): void => {
    const hamming = new Hamming(errorBitsCode.split('').reverse().join(''));
    hamming.setParityBytesCount(true);
    hamming.setParityBytes(true);
     if (hamming.erroneousBit > 0) {
      setErroneusBit(hamming.erroneousBit);
    } else {
      setErroneusBit(0);
    }
  }

  const setErrorBits = () => {
    const errorArray = [error1, error2, error3];
    const tempHammingArray = hammingCode.split('');
    errorArray.forEach((index) => {
      if(index > 0 && index <= hammingCode.length) {
        tempHammingArray[index - 1] = hammingCode[index - 1] === '1' ? '0' : '1';
      }
    });
    setErrorBitsCode(tempHammingArray.join(''));
    setErrorBitsElements(colorBits(tempHammingArray.join(''), byteCode, crcCodeEncode));
  }

  return (
    <div className={classes.root}>
      <TextField
        value={input}
        onChange={(event): void => setInput(event.target.value)}
        label="Input text"
        variant="outlined"
      />
      <TextareaAutosize 
        rowsMax={4}
        rowsMin={4}
        disabled
        value={chunkBytes(input).join('')}
      />
      <Select value={type} onChange={handleSelectChange}>
          <MenuItem value={CrcTypesEnum.CRC16}>CRC-16</MenuItem>
          <MenuItem value={CrcTypesEnum.CRC16REV}>CRC-16 Reverse</MenuItem>
          <MenuItem value={CrcTypesEnum.CRC32}>CRC-32</MenuItem>
      </Select>
      <Button onClick={setCRC}>Encode CRC</Button>
      <div style={{wordWrap: 'break-word', textAlign: 'left'}}>
          <span style={{textAlign: 'left'}}>
              {byteCode}
          </span>
          <span style={{color: 'blue'}}>
              {crcCodeEncode}
          </span>
      </div>
      <Button onClick={setHamming}>Encode Hamming</Button>
      <div style={{wordBreak: 'break-all', textAlign: 'left'}}>
        {coloredBits}
      </div>
      <div>
      <TextField
          label="Error bit index 1"
          type="number"
          onChange={(event): void => setError1(parseInt(event.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Error bit index 2"
          type="number"
          onChange={(event): void => setError2(parseInt(event.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Error bit index 3"
          type="number"
          onChange={(event): void => setError3(parseInt(event.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <Button onClick={setErrorBits}>Set Interrupted Bits</Button>
      <div style={{wordBreak: 'break-all', textAlign: 'left'}}>
        {errorBitsElements}
      </div>
      <Button onClick={decodeHamming}>Decode Hamming</Button>
      {erroneusBit}
      <Button onClick={decodeCRC}>Decode CRC</Button>
      {crcValid ? 'Crc Valid' : 'Crc Invalid'}
    </div>
  );
};

export default ParityPage;
