import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Select, MenuItem } from '@material-ui/core';
import { chunkBytes } from '../utils/utils';
import Hamming from '../utils/hamming';
import CRC, { CrcTypesEnum, CRC_TYPES } from '../utils/CRC';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '50px 100px',
  },
  inputBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    minHeight: '88px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'black',
  },
  inputMargin: {
    marginRight: '40px',
    minWidth: '200px',
    maxWidth: '200px',
    alignSelf: 'center',
  },
  inputMarginBottom: {
    marginBottom: '20px',
  },
  textWordToBinary: {
    flexGrow: 1,
  },
  textHeading: {
    margin: 0,
    padding: '0 20px',
    alignSelf: 'flex-start',
  },
  textBinary: {
    wordWrap: 'break-word',
    textAlign: 'left',
    width: '100%',
    overflow: 'auto',
    maxHeight: '88px',
    minHeight: '88px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'black',
  },
  textBinaryBig: {
    maxHeight: '264px',
    minHeight: '264px',
  },
  textBinarySmall: {
    maxWidth: '120px',
    minWidth: '120px',
    maxHeight: '21px',
    overflow: 'auto',
    marginLeft: '5px',
    display: 'flex',
  },
  button: {
    maxHeight: '36px',
    alignSelf: 'center',
    minWidth: '200px',
    maxWidth: '200px',
  },
  selectBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  textFieldsRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  textFieldsBox: {
    display: 'flex',
    maxWidth: '200px',
    minWidth: '200px',
    flexDirection: 'column',
  },
  textFieldBit: {
    margin: '10px',
  },
  textColumnCell: {
    display: 'flex',
    flexDirection: 'row',
  },
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  textBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'black',
    padding: '10px',
  },
  textColumnCellText: {
    maxWidth: '120px',
    maxHeight: '21px',
    overflow: 'auto',
  },
  textColumnCellTextWide: {
    maxWidth: '120px',
    maxHeight: '21px',
    overflow: 'auto',
  },
  boxVerify: {
    display: 'flex',
    flexDirection: 'column',
    margin: '40px',
  },
});

const ParityPage = (): JSX.Element => {
  const classes = useStyles();

  const [input, setInput] = useState<string>('');

  const [output, setOutput] = useState('');

  const [type, setType] = useState(CrcTypesEnum.CRC16);

  const [crcCodeEncode, setCrcCodeEncode] = useState('');

  const [byteCode, setByteCode] = useState('');

  const [hammingCode, setHammingCode] = useState('');

  const [coloredBits, setColoredBits] = useState<JSX.Element[]>();

  const [errorBitsElements, setErrorBitsElements] = useState<JSX.Element[]>();

  const [errorBitsCode, setErrorBitsCode] = useState('');

  const [erroneusBit, setErroneusBit] = useState('0');

  const [crcValid, setCrcValid] = useState<boolean>();

  const [hammingCodeFixed, setHammingCodeFixed] = useState('');

  const [erroneusBitNoFix, setErroneusBitNoFix] = useState('0');

  const [error1, setError1] = useState(-1);
  const [error2, setError2] = useState(-1);
  const [error3, setError3] = useState(-1);

  const [enCRCDisabled, setEnCRCDisabled] = useState(true);
  const [enHammingDisabled, setEnHammingDisabled] = useState(true);
  const [negateDisabled, setNegateDisabled] = useState(true);
  const [deHammingDisabled, setDeHammingDisabled] = useState(true);
  const [deCRCDisabled, setDeCRCDisabled] = useState(true);

  const handleSelectChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ): void => {
    setType(event.target.value as CrcTypesEnum);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setInput(event.target.value);
    if (event.target.value.length > 0) {
      setEnCRCDisabled(false);
    } else {
      setEnCRCDisabled(true);
    }
  };

  const setCRC = (): void => {
    const crc = new CRC();
    const bitInput = chunkBytes(input).join('');
    crc.encode(bitInput, type);
    setByteCode(bitInput);
    setCrcCodeEncode(crc.CRCRemainderEncode);
    setEnHammingDisabled(false);
  };

  const decodeCRC = (): void => {
    const crc = new CRC();
    const hamming = new Hamming(hammingCodeFixed);
    const outputCRC = hamming.removeHammingBits();
    setOutput(outputCRC);
    setCrcValid(crc.decode(outputCRC, type));
  };

  const colorBits = (
    codeHamming: string,
    code: string,
    codeCRC: string,
    withErrors = false
  ): JSX.Element[] => {
    const hammingArray = codeHamming.split('');
    const byteCodeArray = code.split('').reverse();
    const crcArray = codeCRC.split('').reverse();
    const errorArray = [error1, error2, error3];
    let pow = 0;
    let count = 0;
    const coloredElementsArray = hammingArray.map((bit, index) => {
      if (index + 1 === Math.pow(2, pow)) {
        pow++;
        return (
          <span
            style={{ color: 'green', fontWeight: 'bold' }}
            key={`hamming-${index}`}
          >
            {bit}
          </span>
        );
      }
      const temp = count;
      if (count < crcArray.length) {
        count++;
        return (
          <span
            style={{ color: 'blue', fontWeight: 'bold' }}
            key={`crc-${index}`}
          >
            {crcArray[temp]}
          </span>
        );
      }
      count++;
      return (
        <span key={`code-${index}`}>
          {byteCodeArray[temp - crcArray.length]}
        </span>
      );
    });
    if (withErrors) {
      errorArray.forEach(index => {
        if (index > 0 && index <= coloredElementsArray.length) {
          coloredElementsArray[index - 1] = (
            <span
              style={{ color: 'red', fontWeight: 'bold' }}
              key={`error-${index}`}
            >
              {hammingArray[index - 1]}
            </span>
          );
        }
      });
    }
    return coloredElementsArray.reverse();
  };

  const setHamming = (): void => {
    const test = new Hamming(`${byteCode}${crcCodeEncode}`);
    test.setParityBytesCount(false);
    test.setParityBytes();
    setHammingCode(test.byteCodeReverse);
    setColoredBits(colorBits(test.byteCodeReverse, byteCode, crcCodeEncode));
    setNegateDisabled(false);
  };

  const decodeHamming = (): void => {
    const hamming = new Hamming(
      errorBitsCode
        .split('')
        .reverse()
        .join('')
    );
    hamming.setParityBytesCount(true);
    hamming.setParityBytes(true);
    setErroneusBitNoFix(hamming.parityBytesArray.join(''));
    if (hamming.erroneousBit > 0) {
      hamming.fixErroneusBit();
    }
    setErroneusBit(hamming.parityBytesArray.join(''));
    setHammingCodeFixed(hamming.byteCodeReverse);
    setDeCRCDisabled(false);
  };

  const setErrorBits = (): void => {
    const errorArray = [error1, error2, error3];
    const tempHammingArray = hammingCode.split('');
    errorArray.forEach(index => {
      if (index > 0 && index <= hammingCode.length) {
        tempHammingArray[index - 1] =
          hammingCode[index - 1] === '1' ? '0' : '1';
      }
    });
    setErrorBitsCode(tempHammingArray.join(''));
    setErrorBitsElements(
      colorBits(tempHammingArray.join(''), byteCode, crcCodeEncode, true)
    );
    setDeHammingDisabled(false);
  };

  const translateString = (inputBinary: string): string => {
    const tempArray: string[] = [];
    for(let i = 0; i < inputBinary.length; i = i + 7) {
      tempArray.push(String.fromCharCode(parseInt(inputBinary.substr(i, 7), 2)));
    }
    return tempArray.join('');
  }

  const getVerifyText = (): JSX.Element => {
    if (crcValid) {
      return <h3 style={{ color: 'green' }}>Checksum valid</h3>;
    }
    return <h3 style={{ color: 'red' }}>Checksum invalid</h3>;
  };

  return (
    <div className={classes.root}>
      <h3 className={classes.textHeading}>INPUT</h3>
      <div className={classes.inputBox}>
        <TextField
          className={classes.inputMargin}
          value={input}
          onChange={handleInputChange}
          label="Input text"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <div className={classes.textBinary}>{chunkBytes(input).join('')}</div>
      </div>
      <h3 className={classes.textHeading}>CRC (ENCODING)</h3>
      <div className={classes.inputBox}>
        <div className={`${classes.inputMargin} ${classes.selectBox}`}>
          <Select
            value={type}
            onChange={handleSelectChange}
            className={classes.inputMarginBottom}
          >
            <MenuItem value={CrcTypesEnum.CRC16}>CRC-16</MenuItem>
            <MenuItem value={CrcTypesEnum.CRC16REV}>CRC-16 Reverse</MenuItem>
            <MenuItem value={CrcTypesEnum.CRC32}>CRC-32</MenuItem>
            <MenuItem value={CrcTypesEnum.CRC12}>CRC-12</MenuItem>
            <MenuItem value={CrcTypesEnum.SDLC}>SDLC</MenuItem>
          </Select>
          <Button
            className={classes.button}
            variant="contained"
            onClick={setCRC}
            disabled={enCRCDisabled}
          >
            Encode CRC
          </Button>
        </div>
        <div className={classes.textBinary}>
          <span style={{ textAlign: 'left' }}>{byteCode}</span>
          <span style={{ color: 'blue', fontWeight: 'bold' }}>
            {crcCodeEncode}
          </span>
        </div>
      </div>
      <h3 className={classes.textHeading}>HAMMING CODE (ENCODING)</h3>
      <div className={classes.inputBox}>
        <Button
          className={`${classes.inputMargin} ${classes.button}`}
          onClick={setHamming}
          variant="contained"
          disabled={enHammingDisabled}
        >
          Encode Hamming
        </Button>
        <div className={classes.textBinary}>{coloredBits}</div>
      </div>
      <h3 className={classes.textHeading}>SET ERRONOUS BITS</h3>
      <div className={classes.inputBox}>
        <div className={`${classes.textFieldsBox} ${classes.inputMargin}`}>
          <div className={classes.textFieldsRow}>
            <TextField
              className={classes.textFieldBit}
              label="Error bit 1"
              variant="outlined"
              type="number"
              onChange={(event): void =>
                setError1(parseInt(event.target.value))
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={classes.textFieldBit}
              label="Error bit 2"
              variant="outlined"
              type="number"
              onChange={(event): void =>
                setError2(parseInt(event.target.value))
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={classes.textFieldBit}
              label="Error bit 3"
              variant="outlined"
              type="number"
              onChange={(event): void =>
                setError3(parseInt(event.target.value))
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <Button
            className={classes.button}
            onClick={setErrorBits}
            variant="contained"
            disabled={negateDisabled}
          >
            Negate bits
          </Button>
        </div>
        <div className={`${classes.textBinary} ${classes.textBinaryBig}`}>
          {errorBitsElements}
        </div>
      </div>
      <h3 className={classes.textHeading}>HAMMING CODE (DECODING)</h3>
      <div className={classes.inputBox}>
        <Button
          className={classes.inputMargin}
          onClick={decodeHamming}
          variant="contained"
          disabled={deHammingDisabled}
        >
          Decode Hamming
        </Button>
        <div className={classes.textBox}>
          <div className={classes.textColumn}>
            <div className={classes.textColumnCell}>
              <span>Encoded Hamming bits before negation: </span>
              <span className={classes.textBinarySmall}>
                {erroneusBitNoFix}
              </span>
            </div>
            <div className={classes.textColumnCell}>
              <span>Encoded Hamming bits after negation: </span>
              <span className={classes.textBinarySmall}>{erroneusBit}</span>
            </div>
          </div>
          <div className={classes.textColumn}>
            <div className={classes.textColumnCell}>
              <span>Erroneus bits: </span>
              <span className={classes.textBinarySmall}>
                {error1 > 0 ? error1 : ''}, {error2 > 0 ? error2 : ''},{' '}
                {error3 > 0 ? error3 : ''}
              </span>
            </div>
            <div className={classes.textColumnCell}>
              <span>Bit negated: </span>
              <span className={classes.textBinarySmall}>
                {parseInt(erroneusBitNoFix, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <h3 className={classes.textHeading}>CRC VERIFICATION</h3>
      <div className={classes.inputBox}>
        <div className={`${classes.inputMargin} ${classes.selectBox}`}>
          <Button
            className={classes.button}
            onClick={decodeCRC}
            variant="contained"
            disabled={deCRCDisabled}
          >
            Verify CRC
          </Button>
          {getVerifyText()}
        </div>
        <div className={classes.textBinary}>
          <span style={{ textAlign: 'left' }}>
            {output.substr(0, output.length - CRC_TYPES[type].REMAINDER_LENGTH)}
          </span>
          <span style={{ color: 'blue', fontWeight: 'bold' }}>
            {output.substr(
              output.length - CRC_TYPES[type].REMAINDER_LENGTH,
              CRC_TYPES[type].REMAINDER_LENGTH
            )}
          </span>
        </div>
      </div>
      <h3 className={classes.textHeading}>OUTPUT</h3>
      <div className={classes.inputBox}>
        <div className={classes.textBinary}>
          <span style={{ textAlign: 'left' }}>
            {translateString(output.substr(0, output.length - CRC_TYPES[type].REMAINDER_LENGTH))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParityPage;
