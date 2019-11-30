import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={() => this.props.onClick() }
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square (props) {
  return (
    <button
      className={"square "+props.className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    let board = [];
    const winnerPosition = this.props.winnerPosition;
    for (let i = 0; i < 3; i++) {
      let row = []
      for (let j = 0; j < 3; j++) {
        let isWin = false
        if (winnerPosition) {
          for (let k = 0; k < winnerPosition.length; k++) {
            if (winnerPosition[k] === (j + (i * 3))) {
              isWin = true
              break
            }
          }
        }
        row.push((
          <Square key={ (j + (i * 3)) } className={isWin ? 'win' : ''}
            value={this.props.squares[j + (i * 3)]} 
            onClick={() => { this.props.onClick(j + (i * 3))} }
          />
        ))
      }
      board.push((
        <div key={ 'row:' + i } className="board-row">
          { row }
        </div>
      ))
    }

    return (
      <div>
        { board }
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        index: null
      }],
      stepNumber: 0,
      xIsNext: true,
      orderSorting: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice();

    const obj = calculateWinner(squares)
    if ((obj? obj.winner:null) || squares[i]) {
      return;
    }
    // squares[i] = 'X';
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        index: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  orderHistory () {
    this.setState({
      orderSorting: !this.state.orderSorting
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const obj = calculateWinner(current.squares);
    const winner = obj ? obj.winner : null

    // 这个循环有疑问。。。。move变量只能定义在for循环条件内。。。
    //（估计是变量作用域问题）
    const moves = [];
    for (let i = 0,move = (this.state.orderSorting ? 0 : (history.length-1));
      i < history.length;
      i++,this.state.orderSorting ? move++ : move--) {
      const step = history[move]
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      moves.push((
        <li key={move}>
          <button className={ move === this.state.stepNumber ? 'currentStep' : '' } onClick={() => this.jumpTo(move)}>{desc}</button>
          <span>{ (step.index !== null ? getColAndRow(step.index) : '') }</span>
        </li>
      ))
    }

    let status;
    if (winner) {
      status = 'Winner:' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winnerPosition={winner ? obj.position : null}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={() => this.orderHistory()}>{this.state.orderSorting ? '倒序' : '正序'}</button>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function getColAndRow (index) {
  switch (index) {
    case 0:
      return 'col:1 row:1'
    case 1:
      return 'col:2 row:1'
    case 2:
      return 'col:3 row:1'
    case 3:
      return 'col:1 row:2'
    case 4:
      return 'col:2 row:2'
    case 5:
      return 'col:3 row:2'
    case 6:
      return 'col:1 row:3'
    case 7:
      return 'col:2 row:3'
    case 8:
      return 'col:3 row:3'
    default:
      return ''
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let i
  for (i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        position: lines[i]
      };
    }
  }

  return null;
}
