import { negateStringBit } from "./utils";

class Hamming {

    private byteCode: string;
    private parityBytesCount: number;
    public byteCodeReverse: string;
    public parityBytesArray: string[] = [];
    public erroneousBit = 0;

    constructor(input: string) {
        this.byteCode = input;
        this.parityBytesCount = 0;
        this.byteCodeReverse = this.byteCode.split('').reverse().join('');
    }

    public setParityBytesCount(parityCheck: boolean): void {
        const byteCodeReverseArray = this.byteCodeReverse.split('');
        let i = 0;
        let power = 1;
        while(power <= byteCodeReverseArray.length) {
            i++;
            if(!parityCheck) {
                byteCodeReverseArray.splice(power - 1, 0, '0');
            }
            power = Math.pow(2, i);
        }
        this.byteCodeReverse = byteCodeReverseArray.join('');
        this.parityBytesCount = i;
    }

    public setParityBytes(checkParity = false): void {
        let paritySum = 0;
        this.parityBytesArray = [];
        const byteCodeReverseArray = this.byteCodeReverse.split('');  
        for(let i = 0; i < this.parityBytesCount; i++) {
            paritySum = 0;
            byteCodeReverseArray.forEach((bit, index) => {
                if (this.checkIndexCode(index + 1, i) && bit === '1') {
                    paritySum++;
                }
            });
            if (!checkParity) {
                byteCodeReverseArray[Math.pow(2, i) - 1] = (paritySum % 2).toString();
            }
            this.parityBytesArray.push((paritySum % 2).toString());
        }
        this.byteCodeReverse = byteCodeReverseArray.join('');
        if(checkParity) {
            const erroneusBit = parseInt(this.parityBytesArray.reverse().join(''), 2);
            if (erroneusBit > 0) {
                this.erroneousBit = erroneusBit;
            } else {
                this.erroneousBit = 0;
            }
        }
    }

    public removeHammingBits(): string {
        const tempArray: string[] = [];
        let pow = 0;
        this.byteCode.split('').forEach((elem, index) => {
            if (index + 1 === Math.pow(2, pow)) {
                pow++;
            } else {
                tempArray.push(elem);
            }
        });
        return tempArray.reverse().join('');
    }

    public randomDataError(): void {
        const byteCodeReverseArray = this.byteCodeReverse.split('');
        let changed = true;
        while(changed) {
            const rand = Math.floor(Math.random() * this.byteCodeReverse.length);
            if (!Number.isInteger(Math.sqrt(rand))) {
                console.log(rand);
                byteCodeReverseArray[rand] = negateStringBit(byteCodeReverseArray[rand])
                changed = false;
            }
        }
        console.log(this.byteCodeReverse, 'Before');
        this.byteCodeReverse = byteCodeReverseArray.join('');
        console.log(this.byteCodeReverse, 'After');

    }

    public fixErroneusBit(): void {
        const tempArray = this.byteCodeReverse.split('');
        if(this.erroneousBit) {
            tempArray[this.erroneousBit - 1] = negateStringBit(tempArray[this.erroneousBit - 1]);
            this.byteCodeReverse = tempArray.join('');
            this.setParityBytes(true);
        }
    }

    private checkIndexCode(index: number, parityIndex: number): boolean {
        return index.toString(2).split('').reverse()[parityIndex] === '1'
    }
}

export default Hamming;