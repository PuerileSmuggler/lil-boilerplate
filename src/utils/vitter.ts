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
    public nodes: Node[] = [new Node(null, null, nodeTypes.NYT, 256, 0, null)];

    public inputArray: string[];

    constructor(input: string) {
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
            let parentNode = node.parent;
            node.value++;
            while (parentNode) {
                parentNode.value = parentNode.value + 1;
                console.log(letter, 'same', parentNode.value);
                parentNode = parentNode.parent;
            }
        } else {
            const NYT = this.findNYT();
            if (NYT) {
                this.nodes.push(new Node(null, null, nodeTypes.LEAF, NYT.weight - 1, 1, NYT, letter));
                this.nodes.push(new Node(null, null, nodeTypes.NYT, NYT.weight - 2, 0, NYT));
                NYT.type = nodeTypes.INTERNAL;
                NYT.value = 1;
                let parentNode = NYT.parent;
                while (parentNode) {
                    parentNode.value++;
                    console.log(letter, 'new', parentNode.value);
                    parentNode = parentNode.parent;
                }
            }
        }
        this.updateTree();

    }

    private updateTree(): void {
        this.nodes.sort((a, b) => {
            if ((a.type === nodeTypes.INTERNAL || b.type === nodeTypes.INTERNAL) && a.value === b.value ) {
                return a.type === nodeTypes.INTERNAL ? 1 : -1;
            }
            if (a.value === b.value && (a.type !== nodeTypes.NYT || b.type !== nodeTypes.NYT)) {
                return this.inputArray.findIndex((element) => element === b.letter) - this.inputArray.findIndex((element) => element === a.letter)
            }
            return a.value - b.value;
        });
        const nodesToAssign = [...this.nodes];
        nodesToAssign.pop();
        while (nodesToAssign.length) {
            for(let i = this.nodes.length - 1; i >= 0; i--) {
                if(this.nodes[i].type === nodeTypes.INTERNAL) {
                    const rightChild = nodesToAssign.pop();
                    if (rightChild) {
                        this.nodes[i].rightChild = rightChild;
                        (this.nodes[i].rightChild as Node).parent = this.nodes[i];
                    }
                    const leftChild = nodesToAssign.pop();
                    if (leftChild) {
                        this.nodes[i].leftChild = leftChild;
                        (this.nodes[i].leftChild as Node).parent = this.nodes[i];
                    }
                }
            }

        }
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
}

export default vitterEncode;