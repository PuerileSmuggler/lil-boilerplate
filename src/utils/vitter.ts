enum nodeTypes {
    NYT,
    LEAF,
    INTERNAL
}

type nodeType = Node | null;

class Node {
    public rightChild: nodeType;
    public leftChild: nodeType;
    public parent: nodeType;
    public type: nodeTypes;
    public weight: number;
    public value: number;
    public letter: string | null = null;
    public code = '';

    constructor(rightChild: nodeType, leftChild: nodeType, type: nodeTypes, weight: number, value: number, parent: nodeType, letter?: string) {
        this.rightChild = rightChild;
        this.leftChild = leftChild;
        this.type = type;
        this.weight = weight;
        this.value = value;
        this.parent = parent;
        if (letter) {
            this.letter = letter;
        }
    }
}

class VitterTree {
    public nodes: Node[];

    public root: Node = new Node(null, null, nodeTypes.NYT, 256, 0, null);

    public inputArray: string[];

    public code = '';

    private block: Node[] = [];

    private newNode: Node = new Node(null, null, nodeTypes.NYT, 256, 0, null);

    constructor(input: string) {
        this.nodes = [this.root];
        this.inputArray = input.split('');
    }

    private isLetterInTree(letter: string): Node | undefined {
        return this.nodes.find((node) => {
            return node.letter === letter;
        });
    }

    private findNYT(): Node | undefined {
        return this.nodes.find((node) => {
            return node.type === nodeTypes.NYT;
        })
    }

    addLetter(letter: string): void {
        const node = this.isLetterInTree(letter);
        if(node) {
            this.code += `${node.code} `;
            this.newNode = node;
            this.root.value++;
            this.sortBlock();
        } else {
            const NYT = this.findNYT();
            if (NYT) {
                this.code += `${NYT.code}0${letter.charCodeAt(0).toString(2)} `
                const newNode = new Node(null, null, nodeTypes.LEAF, NYT.weight - 1, 1, NYT, letter);
                const newNYT = new Node(null, null, nodeTypes.NYT, NYT.weight - 2, 0, NYT);
                this.nodes.push(newNode);
                this.nodes.push(newNYT);
                NYT.rightChild = newNode;
                NYT.leftChild = newNYT;
                NYT.type = nodeTypes.INTERNAL;
                NYT.value++;
                this.newNode = NYT;
                this.sortBlock();
            }
        }

    }

    private setBlock(): void {
        if (this.newNode.leftChild && this.newNode.leftChild.type === nodeTypes.NYT) {
            this.block = this.nodes.filter((node) => (node.value === this.newNode.value && node !== this.newNode.rightChild));
        } else {
            this.block = this.nodes.filter((node) => (node.value === this.newNode.value && node !== this.newNode));
        }
    }

    private sortBlock(): void {
        this.setBlock();
        if (this.block.length) {
            this.block.sort((a, b) => {
                if (a.type === nodeTypes.INTERNAL || b.type === nodeTypes.INTERNAL) {
                    return a.type === nodeTypes.INTERNAL ? 1 : -1;
                }
                return a.weight - b.weight;
            });
            if (this.newNode.leftChild && this.newNode.leftChild.type === nodeTypes.NYT) {

               
                this.block.forEach((blockNode, index) => {
                    blockNode.weight = (this.newNode.leftChild as Node).weight + index + 2;
                    console.log(blockNode.weight);
                });
                if (this.newNode !== this.root) {
                    this.root.value++;
                }
            } else {
                this.newNode.weight = this.block[this.block.length - 1].weight;
                this.block.forEach((blockNode, index) => {
                    blockNode.weight = this.newNode.weight - this.block.length + index;
                });
                this.newNode.value++;
            }
        } else {
            this.newNode.value++;
        }
        let prevParent = this.newNode.parent;
        this.updateTree();
        let parent = this.newNode.parent;
        while (parent) {
            parent.value = parent.rightChild ? parent.rightChild.value : 0;
            parent.value += parent.leftChild ? parent.leftChild.value : 0;
            parent = parent.parent;
        }

        while (prevParent) {
            prevParent.value = prevParent.rightChild ? prevParent.rightChild.value : 0;
            prevParent.value += prevParent.leftChild ? prevParent.leftChild.value : 0;
            prevParent = prevParent.parent;
        }
        
        
    }

    private updateTree(): void {
        this.nodes.sort((a, b) => {
            return a.weight - b.weight;
        });
        const nodesToAssign = [...this.nodes];
        nodesToAssign.pop();
        while (nodesToAssign.length) {
            for(let i = this.nodes.length - 1; i >= 0; i--) {
                if(this.nodes[i].type === nodeTypes.INTERNAL) {
                    const rightChild = nodesToAssign.pop();
                    if (rightChild) {
                        this.nodes[i].rightChild = rightChild;
                        rightChild.parent = this.nodes[i];
                        rightChild.code = `${rightChild.parent.code}${1}`
                    }
                    const leftChild = nodesToAssign.pop();
                    if (leftChild) {
                        this.nodes[i].leftChild = leftChild;
                        leftChild.parent = this.nodes[i];
                        leftChild.code = `${leftChild.parent.code}${0}`
                    }
                }
            }

        }
    }

    private appendCode(node: Node, value: number): void {
        if (node.parent && node.parent.code) {
            node.code = node.parent.code + value.toString();
        }
        node.code = value.toString();
    }

    encode(): void {
        this.inputArray.forEach((letter) => {
            this.addLetter(letter);
        })
    }
}



function vitterEncode(input: string): void {
    const tree = new VitterTree(input);

    tree.encode();

    console.log(tree.nodes);
    console.log(tree.code);

    //console.log(tree.root);
    //console.log(tree.code);
}

export default vitterEncode;