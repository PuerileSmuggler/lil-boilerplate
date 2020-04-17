enum nodeTypes {
  NYT,
  LEAF,
  INTERNAL,
}

enum slideType {
  FRONT,
  BACK,
}

type nodeType = Node | null;

export class Node {
  public rightChild: nodeType;
  public leftChild: nodeType;
  public parent: nodeType;
  public type: nodeTypes;
  public weight: number;
  public value: number;
  public letter: string | null = null;
  public code = '';

  public setCodes(code: string): void {
    this.code = `${code}`;
    const rightCode = `${code}1`;
    const leftCode = `${code}0`;
    if(this.rightChild) {
        this.rightChild.setCodes(rightCode);
    }
    if (this.leftChild) {
        this.leftChild.setCodes(leftCode);
    }
  }

  constructor(
    rightChild: nodeType,
    leftChild: nodeType,
    type: nodeTypes,
    weight: number,
    value: number,
    parent: nodeType,
    letter?: string
  ) {
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

class VitterTree extends Node{
  public nodes: Node[];

  public root: Node = new Node(null, null, nodeTypes.NYT, 256, 0, null);

  public inputArray: string[];

  public code = '';

  private block: Node[] = [];

  private newNode: Node = new Node(null, null, nodeTypes.NYT, 256, 0, null);

  private newNodeWeight = 255;
  private parentBeforeSlideWeight = 256;

  public mean: { [key: string]: { value: number; occurances: number} } = {};

  constructor(input: string) {
    super(null, null, nodeTypes.NYT, 256, 0, null);
    this.nodes = [this.root];
    this.inputArray = input.split('');
  }

  private isLetterInTree(letter: string): Node | undefined {
    return this.nodes.find(node => {
      return node.letter === letter;
    });
  }

  private findNYT(): Node | undefined {
    return this.nodes.find(node => {
      return node.type === nodeTypes.NYT;
    });
  }

  addLetter(letter: string): void {
      this.sortNodesArray();
    const node = this.isLetterInTree(letter);
    if (node) {
      this.code += `${node.code} `;
      this.setMean(node.value + 1, node.code, letter);
      this.newNode = node;
      this.addNode();
    } else {
      const NYT = this.findNYT();
      if (NYT) {
        this.code += `${NYT.code}0${letter.charCodeAt(0).toString(2)} `;
        this.setMean(1, `${NYT.code}0${letter.charCodeAt(0).toString(2)}`, letter)
        const newNode = new Node(
          null,
          null,
          nodeTypes.LEAF,
          NYT.weight - 1,
          1,
          NYT,
          letter
        );
        const newNYT = new Node(
          null,
          null,
          nodeTypes.NYT,
          NYT.weight - 2,
          0,
          NYT
        );
        this.nodes.unshift(newNode);
        this.nodes.unshift(newNYT);
        NYT.rightChild = newNode;
        NYT.leftChild = newNYT;
        NYT.type = nodeTypes.INTERNAL;
        NYT.value++;
        this.newNode = NYT;
        this.addNode();
      }
    }
  }

  private setBlock(): void {
    if (
      this.newNode.leftChild &&
      this.newNode.leftChild.type === nodeTypes.NYT
    ) {
      this.block = this.nodes.filter(
        node => node.value === this.newNode.value && node !== this.root
      );
    } else {
      const wgt = this.newNode.weight;
      this.block = this.nodes.filter(
        node =>
          (node.value === this.newNode.value &&
          node !== this.root &&
          node.weight !== wgt)
      );
    }
  }

  private sortBlock(): void {
    this.block.sort((a, b) => {
      return a.type - b.type;
    });
}

  private slideNode(type: slideType): void {
    if (type === slideType.FRONT) {
      this.block.unshift(this.newNode);
    } else {
      this.block.push(this.newNode);
    }
  }

  private getWeightsRangeFromBlock(block: Node[]): number[] {
    const sort = [
      ...block.sort((a, b) => {
        return a.weight - b.weight;
      }),
    ];
    return sort.map(node => node.weight);
  }

  private setBlockWeights(): void {
    const block = [...this.block];
    const newNode = block.find(node => node.weight === this.newNode.weight);
    const range = this.getWeightsRangeFromBlock(this.block);
    const kurwa = block.map((node, index) => {
      if (node.weight === newNode?.weight) {
        if (newNode.parent) {
          this.parentBeforeSlideWeight = newNode.parent.weight;
        }
        this.newNodeWeight = range[index];
      }
      return { ...node, weight: range[index], setCodes: node.setCodes };
    });
    this.block = kurwa;
  }

  private checkBlockType(type: nodeTypes): boolean {
    return [...this.block].reduce((prev: boolean, curr: Node) => {
      if (curr.weight < this.newNode.weight && type === nodeTypes.INTERNAL) {
        return false;
      }
      return prev && curr.type === type;
    }, true);
  }

  private setMean(nodeValue: number, code: string, letter: string): void {
    const rootValue = this.nodes[this.nodes.length - 1].value ? this.nodes[this.nodes.length - 1].value : 1;
    if (this.mean[letter]) {
      this.mean[letter] = { value: (this.mean[letter].value + (nodeValue * code.length)), occurances: this.mean[letter].occurances + 1 };
    } else {
      this.mean[letter] = { value: (nodeValue * code.length), occurances: 1};
    }
  }

  private incrementCascade(): void {
    let node: Node | null = this.newNode;
    if (this.newNode.type === nodeTypes.INTERNAL) {
      node = this.newNode.parent;
    }
    while (node) {
      node.value++;
      node = node.parent;
    }
    node = null;
  }

  private addNode(): void {
    this.setBlock();
    this.sortBlock();
    if (this.newNode.type === nodeTypes.LEAF) {
      if (this.checkBlockType(nodeTypes.INTERNAL)) {
        this.incrementCascade();
        this.setBlock();
        this.sortBlock();
        this.setBlockWeights();
        this.updateTree(false);
      } else {
          this.slideNode(slideType.BACK);
        this.setBlockWeights();
        this.updateTree(false);
        const newNodeIndex = this.nodes.findIndex(
            node => node.weight === this.newNodeWeight
          );
          this.newNode = this.nodes[newNodeIndex];
        this.incrementCascade();
      }
    } else {
      if (this.checkBlockType(nodeTypes.LEAF)) {
        this.incrementCascade();
        this.setBlock();
        this.sortBlock();
        this.setBlockWeights();
        this.updateTree(false);
      } else {
          this.setBlockWeights();
        this.updateTree(false);
        const parentIndex = this.nodes.findIndex(
          node => node.weight === this.parentBeforeSlideWeight
        );
        this.nodes[parentIndex].value++;
        this.newNode = this.nodes[parentIndex];
        this.incrementCascade();
      }
    }
    this.sortNodesArray();
    
  }

  private sortNodesArray(): void {
    const nodes = [...this.nodes];
    this.nodes = nodes.sort((a, b) => {
        if((a.type === nodeTypes.INTERNAL || b.type === nodeTypes.INTERNAL) && a.value === b.value) {
            return a.type - b.type;
        } else {
            return a.value - b.value;
        }
    })
    .map((node, index) => {
        return { ...node, weight: 256 - nodes.length + 1 + index, setCodes: node.setCodes}
    });
    this.nodes[nodes.length - 1].setCodes('');
    this.updateTree(true);
  }

  private updateTree(omitBlockInsert: boolean): void {
    if (!omitBlockInsert) {
      const test = [...this.nodes]
      .map((node, index) => {
        if (this.getWeightsRangeFromBlock(this.block).includes(node.weight)) {
          return index;
        }
        return 0;
      })
      .sort((a, b) => {
        return a - b;
      });
    const zeroIndex = test.lastIndexOf(0);
    test.splice(0, zeroIndex + 1);
    this.nodes.splice(test[0], test.length, ...this.block);
    }
    this.nodes.sort((a, b) => {
      return a.weight - b.weight;
    });
    const nodesToAssign = [...this.nodes];
    nodesToAssign.pop();
    while (nodesToAssign.length) {
      for (let i = this.nodes.length - 1; i >= 0; i--) {
        if (this.nodes[i].type === nodeTypes.INTERNAL) {
          const rightChild = nodesToAssign.pop();
          if (rightChild) {
            this.nodes[i].rightChild = rightChild;
            rightChild.parent = this.nodes[i];
            rightChild.code = `${rightChild.parent.code}${1}`;
          }
          const leftChild = nodesToAssign.pop();
          if (leftChild) {
            this.nodes[i].leftChild = leftChild;
            leftChild.parent = this.nodes[i];
            leftChild.code = `${leftChild.parent.code}${0}`;
          }
        }
      }
    }
  }

  encode(): void {
    this.inputArray.forEach(letter => {
      this.addLetter(letter);
    });
    this.nodes[this.nodes.length - 1].value--; // Nie wiem o chuj chodzi ale root ma zawsze +1 wartości
  }
}

function vitterEncode(input: string): {tree: Node[]; code: string; valueMap: { [key: string]: { value: number; occurances: number } }} {
  const tree = new VitterTree(input);

  tree.encode();
  
  return { tree: tree.nodes, code: tree.code, valueMap: tree.mean }
}

export default vitterEncode;
