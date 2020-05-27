import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { chunkBytes } from '../utils/utils';
import Hamming from '../utils/hamming';
import CRC, { CrcTypesEnum, CRC_TYPES } from '../utils/CRC';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '50px 100px',
    backgroundColor: 'silver'
  },
  inputBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    minHeight: '88px',
    flexDirection: 'column',
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: '20px',
  },
  inputMargin: {
    marginRight: '40px',
    minWidth: '300px',
    maxWidth: '300px',
    alignSelf: 'center',
  },
  inputMarginBottom: {
    marginBottom: '20px',
    flexDirection: 'row',
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
  },
  selectBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  textFieldsRow: {
    display: 'flex',
    flexDirection: 'row',
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
    alignSelf: 'center'
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
  let inputRef;
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

  const [hammingBytes, setHammingBytes] = useState('');

  const [error1, setError1] = useState(0);
  const [error2, setError2] = useState(0);
  const [error3, setError3] = useState(0);

  const [enCRCDisabled, setEnCRCDisabled] = useState(true);
  const [enHammingDisabled, setEnHammingDisabled] = useState(true);
  const [negateDisabled, setNegateDisabled] = useState(true);
  const [deHammingDisabled, setDeHammingDisabled] = useState(true);
  const [deCRCDisabled, setDeCRCDisabled] = useState(true);

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

  const setHamming = (byteCode: string, crcCodeEncode: string): void => {
    const test = new Hamming(`${byteCode}${crcCodeEncode}`);
    test.setParityBytesCount(false);
    test.setParityBytes();
    setHammingBytes(test.parityBytesArray.reverse().join(''));
    setHammingCode(test.byteCodeReverse);
    setColoredBits(colorBits(test.byteCodeReverse, byteCode, crcCodeEncode));
    setNegateDisabled(false);
  };

  const setCRC = (): void => {
    const crc = new CRC();
    const bitInput = chunkBytes(input).join('');
    crc.encode(bitInput, type);
    setByteCode(bitInput);
    setCrcCodeEncode(crc.CRCRemainderEncode);
    setEnHammingDisabled(false);
    setHamming(bitInput, crc.CRCRemainderEncode);
  };

  const decodeCRC = (): void => {
    const crc = new CRC();
    const hamming = new Hamming(hammingCodeFixed);
    const outputCRC = hamming.removeHammingBits();
    setOutput(outputCRC);
    setCrcValid(crc.decode(outputCRC, type));
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

    const crc = new CRC();
    const temp = new Hamming(hamming.byteCodeReverse);
    const outputCRC = temp.removeHammingBits();
    setOutput(outputCRC);
    setCrcValid(crc.decode(outputCRC, type));
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
    for (let i = 0; i < inputBinary.length; i = i + 7) {
      tempArray.push(
        String.fromCharCode(parseInt(inputBinary.substr(i, 7), 2))
      );
    }
    return tempArray.join('');
  };

  const getVerifyText = (): JSX.Element => {
    if (crcValid) {
      return <h3 style={{ color: 'green' }}>Poprawny</h3>;
    }
    return <h3 style={{ color: 'red' }}>Niepoprawny</h3>;
  };

  return (
    <div className={classes.root}>
      <div className={classes.inputBox}>
        <div className={classes.inputRow}>
          Słowo do zakodowania:
          <TextField
            className={classes.inputMargin}
            value={input}
            onChange={handleInputChange}
            label="Input text"
            InputLabelProps={{
              shrink: true,
              style: { display: 'none' },
            }}
            style={{ marginLeft: '10px' }}
          />
          <Button className={classes.button} variant="outlined">
            Tłumacz
          </Button>
        </div>
        Kod binarny:
        <div className={classes.textBinary}>{chunkBytes(input).join('')}</div>
      </div>
      <div className={classes.inputBox}>
        <div className={`${classes.selectBox}`}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Typ CRC</FormLabel>
            <RadioGroup
              aria-label="Typ"
              value={type}
              onChange={handleSelectChange}
              className={classes.inputMarginBottom}
            >
              <FormControlLabel
                value={CrcTypesEnum.CRC16}
                control={<Radio />}
                label="CRC16"
              />
              <FormControlLabel
                value={CrcTypesEnum.CRC16REV}
                control={<Radio />}
                label="CRC16 Reverse"
              />
              <FormControlLabel
                value={CrcTypesEnum.CRC12}
                control={<Radio />}
                label="CRC12"
              />
              <FormControlLabel
                value={CrcTypesEnum.CRC32}
                control={<Radio />}
                label="CRC32"
              />
            </RadioGroup>
          </FormControl>
          <Button
            className={`${classes.button} ${classes.inputMarginBottom}`}
            variant="outlined"
            onClick={setCRC}
          >
            Koduj CRC
          </Button>
        </div>
        Dane:
        <div className={classes.textBinary}>
          <span style={{ textAlign: 'left' }}>{byteCode}</span>
        </div>
        Kod CRC:
        <div className={classes.textBinary}>
          <span style={{ textAlign: 'left' }}>{crcCodeEncode}</span>
        </div>
        Bity kodu Hamminga:
        <div className={classes.textBinary}>{hammingBytes}</div>
      </div>
      <div className={classes.inputBox}>
        <div className={`${classes.textFieldsBox} ${classes.inputMargin}`}>
          Bity do zanegowania:
          <div className={`${classes.textFieldsRow} ${classes.inputMarginBottom}`}>
            <TextField
              className={classes.textFieldBit}
              label="Error bit 1"
              type="number"
              onChange={(event): void =>
                setError1(parseInt(event.target.value))
              }
              InputLabelProps={{
                shrink: true,
                style: {display: 'none'}
              }}
            />
            <TextField
              className={classes.textFieldBit}
              label="Error bit 2"
              type="number"
              onChange={(event): void =>
                setError2(parseInt(event.target.value))
              }
              InputLabelProps={{
                shrink: true,
                style: {display: 'none'}
              }}
            />
            <TextField
              className={classes.textFieldBit}
              label="Error bit 3"
              type="number"
              onChange={(event): void =>
                setError3(parseInt(event.target.value))
              }
              InputLabelProps={{
                shrink: true,
                style: {display: 'none'}
              }}
            />
          </div>
          <Button
            className={`${classes.button} ${classes.inputMarginBottom}`}
            onClick={setErrorBits}
            variant="outlined"
          >
            Neguj bity
          </Button>
        </div>
        Kod binarny po negacji:
        <div className={`${classes.textBinary} ${classes.textBinary}`}>
          {errorBitsCode.split('').reverse().join('')}
        </div>
      </div>
      <div className={classes.inputBox}>
        <Button
          className={`${classes.button} ${classes.inputMarginBottom}`}
          onClick={decodeHamming}
          variant="outlined"
        >
          Dekoduj bity Hamminga
        </Button>
        Kod binarny po dekodowaniu bitów Hamminga:
        <div className={`${classes.textBinary} ${classes.textBinary}`}>
          {hammingCodeFixed.split('').reverse().join('')}
        </div>
            <div className={classes.textColumnCell}>
              <span>Błędne bity: </span>
              <span className={classes.textBinarySmall}>
                {error1}, {error2}, {error3}
              </span>
            </div>
            <div className={classes.textColumnCell}>
              <span>Naprawiony bit: </span>
              <span className={classes.textBinarySmall}>
                {parseInt(erroneusBitNoFix, 2)}
              </span>
            </div>
      </div>
      <div className={classes.inputBox}>
        <div className={`${classes.inputMargin} ${classes.selectBox}`}>
          <h3>Weryfikacja CRC</h3>
          {getVerifyText()}
        </div>
      </div>
    </div>
  );
};

export default ParityPage;
