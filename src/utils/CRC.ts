type CrcTypes = {
    [key: string]: {
        POLYNOMIAL: string;
        REMAINDER_LENGTH: number;
    };
}
export enum CrcTypesEnum {
    CRC16 = "crc-16",
    CRC16REV = "crc-16-reverse",
    CRC32 = "crc32",
    test = "test"
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
    "crc32": {
        POLYNOMIAL: 0x104c11db7,
        REMAINDER_LENGTH: 32,
      },
      "test": {
        POLYNOMIAL: 0x11D,
        REMAINDER_LENGTH: 8,
      }
}

class CRC {

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
        const errorCRC = this.countRemainder(this.formatDataCode('01110101100000001011001', CRCRemainder), type);
        console.log(parseInt(errorCRC, 2));
        console.log(ECTable.findIndex((el) => el === parseInt(errorCRC, 2)));
        return this.formatDataCode(extDataCode, CRCRemainder);
    }

    countRemainder(extData: string, type: CrcTypesEnum): string {
        let data = extData;
        console.log(data, 'data', data.length);
        const remainderLength = CRC_TYPES[type].REMAINDER_LENGTH;
        while (data.length > remainderLength) {
            const tempData = data.slice(0, remainderLength + 1);
            console.log(tempData, '/');
            console.log(CRC_TYPES[type].POLYNOMIAL.toString(2));
            if (this.checkLeftmostBits(tempData)) {
                data = data.slice(1, data.length);
            } else {
                data = `${this.formatRemainder((parseInt(tempData, 2) ^ CRC_TYPES[type].POLYNOMIAL).toString(2), type)}${data.slice(remainderLength + 1, data.length)}`;
            }
            console.log(data, 'data', data.length);
        }
        return data;
    }

    checkLeftmostBits(data: string): boolean {
        return data.split('')[0] === '0';
    }

    initErrorCorrectionTable(data: string[], type: CrcTypesEnum): number[] {
        console.log(data, 'asdjaikjd')
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
}

export default CRC;