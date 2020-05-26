import { chunkBytes } from "./utils";

class Hamming {

    private input: string;
    private bytesArray: string[];
    private byteCode: string;
    private parityBytesCount: number;
    private byteCodeReverse: string;
    private parityBytesArray: string[] = [];

    constructor(input: string) {
        this.input = input;
        this.bytesArray = chunkBytes(input);
        this.byteCode = this.bytesArray.join('');
        this.parityBytesCount = 0;
        this.byteCodeReverse = this.byteCode.split('').reverse().join('');
    }

    public setParityBytesCount(): void {
        const byteCodeReverseArray = this.byteCodeReverse.split('');
        let i = 0;
        let power = 1;
        while(power <= byteCodeReverseArray.length) {
            i++;
            byteCodeReverseArray.splice(power - 1, 0, '0');
            power = Math.pow(2, i);
        }
        this.byteCodeReverse = byteCodeReverseArray.join('');
        this.parityBytesCount = i;
    }

    public setParityBytes(checkParity = false): void {

        let paritySum: number;
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
            console.log(this.byteCode);
            console.log(this.parityBytesArray.join(''));
            console.log(parseInt(this.parityBytesArray.reverse().join(''), 2));
        }
    }

    public randomDataError(): void {
        const byteCodeReverseArray = this.byteCodeReverse.split('');
        let changed = true;
        while(changed) {
            const rand = Math.floor(Math.random() * this.byteCodeReverse.length);
            if (!Number.isInteger(Math.sqrt(rand))) {
                console.log(rand);
                byteCodeReverseArray[rand] = byteCodeReverseArray[rand] === '1' ? '0' : '1';
                changed = false;
            }
        }
        console.log(this.byteCodeReverse, 'Before');
        this.byteCodeReverse = byteCodeReverseArray.join('');
        console.log(this.byteCodeReverse, 'After');

    }

    private checkIndexCode(index: number, parityIndex: number): boolean {
        return index.toString(2).split('').reverse()[parityIndex] === '1'
    }
}

export default Hamming;