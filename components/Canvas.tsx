import * as React from 'react';
import Canvas from 'react-native-canvas';

import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { map1 as map, map1CellSize as mapCellSize } from '../constants/Maps';


class MyCanvas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      position: props.position,
      destination: props.destination,
      information: props.information,
      store: props.store,
    };
  }

  componentDidMount() {
    fetch('localhost:3001/map')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.map });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  handleCanvas(canvas) {
    if(canvas && !isLoading) {
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

      const drawPoint = (obj, color) => {
        if(obj.x !== undefined) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(obj.x * mapCellSize, obj.y * mapCellSize);
          ctx.lineTo((obj.x + 1) * mapCellSize, obj.y * mapCellSize);
          ctx.lineTo((obj.x + 1) * mapCellSize, (obj.y + 1) * mapCellSize);
          ctx.lineTo(obj.x * mapCellSize, (obj.y + 1) * mapCellSize);
          ctx.lineTo(obj.x * mapCellSize, obj.y * mapCellSize);
          ctx.fill();
        }
      }

      drawPoint(position, '#d9a066');
      drawPoint(destination, '#8f563b');

      if(information > 0) {
        fetch('localhost:3001/info/' + information)
          .then((response) => response.json())
          .then((json) => {
            props.store.dispatch({ type: 'SAVE', payload: json.data });
          })
          .catch((error) => console.error(error))

        ctx.fillStyle = '#707174';
        ctx.beginPath();
        map.forEach((row, ri) => {
          row.forEach((col, ci) => {
            if(col === information) {
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

      if(position.x !== undefined && position.y !== undefined) {
        if(map[position.x + 1]) {
          map[position.x + 1][position.y + 1] = map[position.x + 1][position.y + 1] === 0 ? -1 : map[position.x + 1][position.y + 1];
          map[position.x + 1][position.y - 1] = map[position.x + 1][position.y - 1] === 0 ? -1 : map[position.x + 1][position.y - 1];
        }
        if(map[position.x - 1]) {
          map[position.x - 1][position.y + 1] = map[position.x - 1][position.y + 1] === 0 ? -1 : map[position.x - 1][position.y + 1];
          map[position.x - 1][position.y - 1] = map[position.x - 1][position.y - 1] === 0 ? -1 : map[position.x - 1][position.y - 1];
        }
        map[destination.x][destination.y] = 'd';
        for(let i = 1; i < map.length * map[0].length; i++) {
          map.forEach((row, rowI) => {
            row.forEach((col, colI) => {
              if(map[rowI][colI] === -i) {
                if(map[rowI + 1]) {
                  map[rowI + 1][colI + 1] = map[rowI + 1][colI + 1] === 0 ? -i - 1 : map[rowI + 1][colI + 1];
                  map[rowI + 1][colI - 1] = map[rowI + 1][colI - 1] === 0 ? -i - 1 : map[rowI + 1][colI - 1];
                }
                if(map[rowI - 1]) {
                  map[rowI - 1][colI + 1] = map[rowI - 1][colI + 1] === 0 ? -i - 1 : map[rowI - 1][colI + 1];
                  map[rowI - 1][colI - 1] = map[rowI - 1][colI - 1] === 0 ? -i - 1 : map[rowI - 1][colI - 1];
                }
              }
            });
          });
        }
        let backPosition = {};
        if(map[destination.x + 1]) {
          backPosition = map[destination.x + 1][destination.y + 1] > map[backPosition.x][backPosition.y] ? {x: destination.x + 1, y: destination.y + 1} : backPosition;
          backPosition = map[destination.x + 1][destination.y - 1] > map[backPosition.x][backPosition.y] ? {x: destination.x + 1, y: destination.y - 1} : backPosition;
        }
        if(map[destination.x - 1]) {
          backPosition = map[destination.x - 1][destination.y + 1] > map[backPosition.x][backPosition.y] ? {x: destination.x - 1, y: destination.y + 1} : backPosition;
          backPosition = map[destination.x - 1][destination.y - 1] > map[backPosition.x][backPosition.y] ? {x: destination.x - 1, y: destination.y - 1} : backPosition;
        }
        map[backPosition.x][backPosition.y] = -1;
        let counter = map[backPosition.x][backPosition.y];
        while(counter < 0) {
          let curPosition = {};
          if(map[destination.x + 1]) {
            curPosition = map[destination.x + 1][destination.y + 1] > map[backPosition.x][backPosition.y] ? {x: destination.x + 1, y: destination.y + 1} : curPosition;
            curPosition = map[destination.x + 1][destination.y - 1] > map[backPosition.x][backPosition.y] ? {x: destination.x + 1, y: destination.y - 1} : curPosition;
          }
          if(map[destination.x - 1]) {
            curPosition = map[destination.x - 1][destination.y + 1] > map[backPosition.x][backPosition.y] ? {x: destination.x - 1, y: destination.y + 1} : curPosition;
            curPosition = map[destination.x - 1][destination.y - 1] > map[backPosition.x][backPosition.y] ? {x: destination.x - 1, y: destination.y - 1} : curPosition;
          }
          map[curPosition.x][curPosition.y] = -1;
          counter++;
        }
        map[destination.x][destination.y] = 0;

        ctx.fillStyle = Colors['dark'].darkMedium;
        ctx.beginPath();
        map.forEach((row, ri) => {
          row.forEach((col, ci) => {
            if(col === -1) {
              ctx.moveTo(ci * mapCellSize, ri * mapCellSize);
              ctx.lineTo((ci + 1) * mapCellSize, ri * mapCellSize);
              ctx.lineTo((ci + 1) * mapCellSize, (ri + 1) * mapCellSize);
              ctx.lineTo(ci * mapCellSize, (ri + 1) * mapCellSize);
              ctx.lineTo(ci * mapCellSize, ri * mapCellSize);
              col = 0;
            } else {
              if(col < 0) col = 0;
            }
          })
        })
        ctx.fill();
      }
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