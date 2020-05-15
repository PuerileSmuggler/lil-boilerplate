export const chunkBytes = (input: string): string[] => {
    return input.split('').map(letter => {
        let byteCode = letter.charCodeAt(0).toString(2);
        while (byteCode.length < 7) {
            byteCode = '0' + byteCode;
        }
        return byteCode;
    })
};