import * as React from 'react';
import Canvas from 'react-native-canvas';

import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { map1 as map, map1CellSize as mapCellSize } from '../constants/Maps';


class MyCanvas extends React.PureComponent {

  handleCanvas(canvas) {
    if(canvas) {
      canvas.height = Layout.window.height - Layout.margins.vertical;
      canvas.width = Layout.window.width - Layout.margins.horizontal;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = Colors['dark'].light;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = Colors['dark'].darkMedium;
      ctx.beginPath();
      map.forEach((row, ri) => {
        row.forEach((col, ci) => {
          if(col) {
            ctx.moveTo(ci * mapCellSize, ri * mapCellSize);
            ctx.lineTo((ci + 1) * mapCellSize, ri * mapCellSize);
            ctx.lineTo((ci + 1) * mapCellSize, (ri + 1) * mapCellSize);
            ctx.lineTo(ci * mapCellSize, (ri + 1) * mapCellSize);
            ctx.lineTo(ci * mapCellSize, ri * mapCellSize);
          }
        })
      })
      ctx.fill();
    }
  }

  render() {
    return (
      <Canvas style={style} ref={this.handleCanvas}/>
    )
  }
}

const style = {
  marginVertical: 50,
  borderStyle: 'solid',
  borderWidth: 2,
  borderColor: Colors['dark'].lightMedium
}

export default MyCanvas;