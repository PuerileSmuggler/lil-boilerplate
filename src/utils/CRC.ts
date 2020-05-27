type CrcTypes = {
    [key: string]: {
        POLYNOMIAL: string;
        REMAINDER_LENGTH: number;
    };
}
export enum CrcTypesEnum {
    CRC16 = "crc-16",
    CRC16REV = "crc-16-reverse",
    CRC32 = "crc-32",
    CRC12 = "crc-12",
    SDLC = "sdlc"
}

const CRC_TYPES = {
    "crc-16": {
        POLYNOMIAL: 0x18005,
        REMAINDER_LENGTH: 16
    },
    "crc-16-reverse": {
        POLYNOMIAL: 0x14003,
        REMAINDER_LENGTH: 16
    },
    "crc-32": {
        POLYNOMIAL: 0x104c11db7,
        REMAINDER_LENGTH: 32,
      },
    "crc-12": {
        POLYNOMIAL: 0x180F,
        REMAINDER_LENGTH: 12,
    },
    "sdlc": {
        POLYNOMIAL: 0x11021,
        REMAINDER_LENGTH: 16,
    }
}

class CRC {

    public dataCode: string;
    public CRCRemainderEncode: string;
    public CRCRemainderDecode: string;
    public errorIndexes: number[];
    
    constructor() {
        this.dataCode = '';
        this.CRCRemainderEncode = '';
        this.CRCRemainderDecode = '';
        this.errorIndexes = [];
    }

    initTable(data: string[], type: CrcTypesEnum): string {
        for (let i = 0; i<CRC_TYPES[type].REMAINDER_LENGTH; i++) {
            data.push('0');
        }
        return data.join('');
    }

    encode(data: string, type: CrcTypesEnum): string {
        const dataCode = data.split('');
        const extDataCode = this.initTable(dataCode, type);
        const CRCRemainder = this.countRemainder(extDataCode, type);
        const ECTable = this.initErrorCorrectionTable(data.split(''), type);
        const errorCRC = this.countRemainder(this.formatDataCode(extDataCode, CRCRemainder), type);
        this.dataCode = extDataCode.slice(0, extDataCode.length - CRCRemainder.length);
        this.CRCRemainderDecode = this.formatRemainder(errorCRC, type);
        this.CRCRemainderEncode = this.formatRemainder(CRCRemainder, type);
        // console.log(parseInt(errorCRC, 2));
        // console.log(ECTable.findIndex((el) => el === parseInt(errorCRC, 2)));
        // console.log(this.checkCRC(errorCRC));
        return this.formatDataCode(extDataCode, CRCRemainder);
    }

    decode(data: string, type: CrcTypesEnum): boolean {
        const errorCRC = this.countRemainder(data, type);
        return this.checkCRC(errorCRC);
    }

    countRemainder(extData: string, type: CrcTypesEnum): string {
        let data = extData;
        const remainderLength = CRC_TYPES[type].REMAINDER_LENGTH;
        while (data.length > remainderLength) {
            const tempData = data.slice(0, remainderLength + 1);
            if (this.checkLeftmostBits(tempData)) {
                data = data.slice(1, data.length);
            } else {
                data = `${((parseInt(tempData, 2) ^ CRC_TYPES[type].POLYNOMIAL) >>> 0).toString(2)}${data.slice(remainderLength + 1, data.length)}`;
            }
        }
        return data;
    }

    checkLeftmostBits(data: string): boolean {
        return data.split('')[0] === '0';
    }

    initErrorCorrectionTable(data: string[], type: CrcTypesEnum): number[] {
        const dataLength = data.length;
        const maxDataLength = Math.pow(2, CRC_TYPES[type].REMAINDER_LENGTH);
        if (dataLength < maxDataLength) {
            const ECDataTable = this.initECDataTable(dataLength, type);
            const ECTable = []
            for(let i = 0; i < dataLength ; i++) {
                ECDataTable[i] = '1';
                const crcCode = this.countRemainder(ECDataTable.join(''), type);
                ECTable[i] = parseInt(crcCode, 2);
                ECDataTable[i] = '0';
            }
            return ECTable;
        }
        return [];
    }

    setErrors(indexes: number[], code: string[]): string[] {
        const newCode = code;
        this.errorIndexes = indexes;
        indexes.forEach((errorIndex) => {
            const bitIndex = newCode.length - errorIndex;
            newCode[bitIndex] = newCode[bitIndex] === '1' ? '0' : '1';
        });
        return newCode;
    }

    initECDataTable(size: number, type: CrcTypesEnum): string[] {
        const ECTable = [];
        for(let i = 0; i < size + CRC_TYPES[type].REMAINDER_LENGTH; i++) {
            ECTable[i] = '0';
        }
        return ECTable;
    }

    formatRemainder(data: string, type: CrcTypesEnum): string {
        let dataTemp = data;
        while(dataTemp.length <= CRC_TYPES[type].REMAINDER_LENGTH) {
            dataTemp = `0${dataTemp}`;
        }
        return dataTemp.slice(1, dataTemp.length);
    }

    formatDataCode(extData: string, CRCRemainder: string): string {
        const extDataLength = extData.length;
        const remainderLength = CRCRemainder.length;
        return `${extData.slice(0, extDataLength - remainderLength)}${CRCRemainder}`;
    }

    checkCRC(crcCode: string): boolean {
        const isError = (crcCode.split('').findIndex((elem) => elem === '1') !== -1);
        if(isError) {
            return false;
        }
        return true;
    }
}

export default CRC;