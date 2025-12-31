import { useState } from 'react';
import styles from './Game.module.css';

type Cell = 'X' | 'O' | null;
type Board = Cell[][];
type Position = [number, number];

const Game = () => {
    const [board, setBoard] = useState<Board>(
        Array.from({ length: 3 }, () => Array(3).fill(null))
    );

    const [xPlacements, setXPlacements] = useState<Position[]>([]);
    const [oPlacements, setOPlacements] = useState<Position[]>([]);

    const [turn, setTurn] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState<'X' | 'O' | null>(null);

    // Состояние для анимации исчезновения
    const [removingCell, setRemovingCell] = useState<Position | null>(null);

    const checkWinner = (currentBoard: Board, player: 'X' | 'O'): boolean => {
        for (let i = 0; i < 3; i++) {
            if (
                currentBoard[i][0] === player &&
                currentBoard[i][1] === player &&
                currentBoard[i][2] === player
            )
                return true;
            if (
                currentBoard[0][i] === player &&
                currentBoard[1][i] === player &&
                currentBoard[2][i] === player
            )
                return true;
        }

        if (
            currentBoard[0][0] === player &&
            currentBoard[1][1] === player &&
            currentBoard[2][2] === player
        )
            return true;
        if (
            currentBoard[0][2] === player &&
            currentBoard[1][1] === player &&
            currentBoard[2][0] === player
        )
            return true;

        return false;
    };

    const handleClick = (row: number, col: number) => {
        if (board[row][col] !== null || winner) return;

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = turn;

        const placements = turn === 'X' ? [...xPlacements] : [...oPlacements];
        placements.push([row, col]);

        let shouldRemove = false;
        let removePos: Position | null = null;

        if (placements.length === 3) {
            if (checkWinner(newBoard, turn)) {
                setWinner(turn);
            } else {
                shouldRemove = true;
                removePos = placements.shift()!; // самая старая
                newBoard[removePos[0]][removePos[1]] = null;
            }
        }

        setBoard(newBoard);

        if (turn === 'X') {
            setXPlacements(placements);
        } else {
            setOPlacements(placements);
        }

        // Анимация исчезновения
        if (shouldRemove && removePos) {
            setRemovingCell(removePos);
            setTimeout(() => {
                setRemovingCell(null);
            }, 600); // длительность анимации
        }

        if (!winner) {
            setTurn(turn === 'X' ? 'O' : 'X');
        }
    };

    const resetGame = () => {
        setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)));
        setXPlacements([]);
        setOPlacements([]);
        setTurn('X');
        setWinner(null);
        setRemovingCell(null);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>TIC-TAC-TOE</h1>

            <div className={styles.turnIndicator}>
                <span>Moves:</span>
                <div className={`${styles.turnSymbol} ${turn === 'X' ? styles.x : styles.o}`}>
                    {turn === 'X' ? '×' : '○'}
                </div>
            </div>

            <div className={styles.board}>
                {board.map((row, rowIdx) =>
                    row.map((cell, colIdx) => {
                        const isRemoving = removingCell && removingCell[0] === rowIdx && removingCell[1] === colIdx;

                        return (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className={styles.cell}
                                onClick={() => handleClick(rowIdx, colIdx)}
                            >
                                {cell && (
                                    <div
                                        className={`${styles.symbol} ${cell === 'X' ? styles.x : styles.o} ${isRemoving ? styles.fadeOut : ''
                                            }`}
                                    >
                                        {cell === 'X' ? '×' : '○'}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {winner && (
                <div className={styles.winnerOverlay}>
                    <div className={`${styles.winnerText} ${winner === 'X' ? styles.x : styles.o}`}>
                        The winner is {winner === 'X' ? '×' : '○'}!
                    </div>
                    <button className={styles.restartButton} onClick={resetGame}>
                        Play again
                    </button>
                </div>
            )}

            {!winner && (
                <button className={styles.restartButton} onClick={resetGame} style={{ marginTop: '3rem' }}>
                    New game
                </button>
            )}
        </div>
    );
}

export default Game;