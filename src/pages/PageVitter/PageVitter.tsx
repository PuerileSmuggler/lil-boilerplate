/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react';
import useStyles from './PageVitterStyles';
import { TextField, Button } from '@material-ui/core';
import vitterEncode from '../../utils/vitter';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { Node } from '../../utils/vitter';

interface PropsType {}

const PageVitter: React.FunctionComponent<PropsType> = () => {
  const classes = useStyles();

  const [input, setInput] = useState<string>();

  const [tree, setTree] = useState<{ tree: Node[]; code: string }>();

  const [code, setCode] = useState<string>();

  const [goDiagram, setGoDiagram] = useState<go.Diagram>();

  const [mean, setMean] = useState<number>(0);

  const [entropy, setEntropy] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInputChange = (event: any): void => {
    setInput(event.target.value);
  };

  const initDiagram = () => {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, {
      'undoManager.isEnabled': true,
      layout: $(
        go.TreeLayout, // specify a Diagram.layout that arranges trees
        { angle: 90, layerSpacing: 35 }
      ),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: 'key',
      }),
    });
    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      $(
        go.Shape,
        {
          figure: 'Ellipse',
          name: 'SHAPE',
          fill: null,
          width: 80,
          height: 80,
        },

        new go.Binding('figure', 'fig')
      ),
      $(
        go.Panel,
        go.Panel.Vertical,
        {},

        $(
          go.TextBlock,
          { font: 'normal 12pt Times New Roman' },
          new go.Binding('text')
        ),
        $(
          go.TextBlock,
          { margin: 4, font: 'bold 14pt Times New Roman' },
          new go.Binding('text', 'letter')
        ),
        $(
          go.TextBlock,
          { font: 'normal 8pt Times New Roman' },
          new go.Binding('text', 'weight')
        )
      )
    );
    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Orthogonal, corner: 5 },
      $(go.Shape, { strokeWidth: 3, stroke: '#555' })
    );

    setGoDiagram(diagram);

    return diagram;
  };

  const setMeanState = (nodes: Node[]) => {
    let mean = 0;
    let entrophy = 0;
    nodes.forEach(node => {
      if (node.type === 1) {
        mean += node.value * node.code.length;
        entrophy -=
          (node.value / nodes[nodes.length - 1].value) *
          Math.log2(node.value / nodes[nodes.length - 1].value);
      }
    });
    setMean(mean / nodes[nodes.length - 1].value);
    setEntropy(entrophy);
  };

  const prepDataArray = () => {
    if (tree) {
      return tree.tree.map(node => {
        return {
          key: node.code,
          letter: node.type === 0 ? 'NYT' : node.letter,
          text: node.value,
          weight: node.weight,
          fig: node.type === 2 ? 'Ellipse' : 'Rectangle',
        };
      });
    }
    return null;
  };

  const prepLinkDataArray = () => {
    if (tree) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const linkTable: any[] = [];
      tree.tree.forEach((node, index) => {
        if (node.leftChild) {
          linkTable.push({
            key: -index + '0',
            from: node.code,
            to: node.leftChild.code,
          });
        }
        if (node.rightChild) {
          linkTable.push({
            key: -index + '1',
            from: node.code,
            to: node.rightChild.code,
          });
        }
      });
      return linkTable;
    }
    return null;
  };

  const setCodeWord = (input: string) => {
    const codeLetter: string[] = [];
    const joinCode = input.split(' ').join('');
    for (let i = 0; i <= joinCode.length / 8; i++) {
      codeLetter.push(joinCode.substring(i * 8, i * 8 + 8));
    }
  };

  const onClick = (): void => {
    if (input) {
      const vitter = vitterEncode(input);
      setTree(vitter);
      setCode(vitter.code);
      setCodeWord(vitter.code);
      setMeanState(vitter.tree);
    }
  };

  const onKeyPress = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      if (input) {
        const vitter = vitterEncode(input);
        setTree(vitter);
        setCode(vitter.code);
        setCodeWord(vitter.code);
        setMeanState(vitter.tree);
      }
    }
  };

  const downloadCallback = (img: Blob) => {
    const url = window.URL.createObjectURL(img);
    const filename = 'diagram.svg';

    const a = document.createElement('a');
    a.setAttribute('class', classes.hideDisplay);
    a.href = url;
    a.download = filename;

    // IE 11
    if (window.navigator.msSaveBlob !== undefined) {
      window.navigator.msSaveBlob(img, filename);
      return;
    }

    document.body.appendChild(a);
    requestAnimationFrame(function() {
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };

  const downloadOnClick = () => {
    if (goDiagram) {
      const svg = goDiagram.makeSvg({ scale: 1, background: 'white' });
      const svgstr = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgstr], { type: 'image/svg+xml' });
      downloadCallback(blob);
    }
  };

  const renderDiagram = () => {
    const dataArray = prepDataArray();
    const linkArray = prepLinkDataArray();

    return (
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName={classes.diagramComponent}
        nodeDataArray={dataArray ? dataArray : []}
        linkDataArray={linkArray ? linkArray : []}
        onModelChange={() => {
          console.log('henlo');
        }}
        skipsDiagramUpdate={false}
      />
    );
  };
  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <TextField
          className={classes.textField}
          variant="outlined"
          label="Word to encode"
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          multiline
        />
        <TextField
          className={classes.textField}
          disabled
          value={code}
          multiline
          placeholder={'Code'}
        />
        <TextField
          className={classes.textField}
          disabled
          value={mean}
          placeholder={'Mean'}
        />
        <TextField
          className={classes.textField}
          disabled
          value={entropy}
          placeholder={'Entropy'}
        />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Button onClick={downloadOnClick}>Download</Button>
          <Button onClick={onClick}>Encode</Button>
        </div>
      </div>
      {renderDiagram()}
    </div>
  );
};

export default PageVitter;
