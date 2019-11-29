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
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = []
      for (let j = 0; j < 3; j++) {
        row.push((
          <Square key={ (j + (i * 3)) }
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
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
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
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      return (
        <li key={move}>
          <button className={ move === this.state.stepNumber ? 'currentStep' : '' } onClick={() => this.jumpTo(move)}>{desc}</button>
          <span>{ (step.index !== null ? getColAndRow(step.index) : '') }</span>
        </li>
      )
    })

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
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
