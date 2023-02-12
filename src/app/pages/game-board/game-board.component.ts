import { Component } from '@angular/core';
import { DataStoreHelper } from '../../helpers/data-store/data-store.helper';
import { Dot, DrawedLine, DrawedSquare, Line, Player, Square, Team } from '../../models';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent
{
  allSquares!: Square[];
  allDrawedSquares: DrawedSquare[] = [];
  clickedDot1: Dot | null = null;
  clickedDot2: Dot | null = null;
  allLines!: Line[];
  allDrawedLines: DrawedLine[] = [];
  displayLines: Line[][] = [];
  selectedPlayer!: Player;

  lineStyles: any = {};
  squareStyles: any = {};
  player1!: Player;
  player2!: Player;
  score: any;
  numberOfColumns!: number;
  numberOfRows!: number;

  constructor(
    private dataStoreHelper: DataStoreHelper
  )
  {
  }

  onClickDot(dot: Dot): void
  {
    if (this.clickedDot1 == null)
    {
      this.clickedDot1 = dot;
    } else
    {
      this.clickedDot2 = dot;
    }

    if (this.clickedDot1 != null && this.clickedDot2 != null)
    {
      this.checkAndDrawLine(this.clickedDot1, this.clickedDot2);
    }
  }

  checkAndDrawLine(clickedDot1: Dot, clickedDot2: Dot): void
  {
    const line = this.allLines.find(line =>
      (line.dot1.order === clickedDot1.order && line.dot2.order === clickedDot2.order) ||
      (line.dot2.order === clickedDot1.order && line.dot1.order === clickedDot2.order)
    );

    if (line !== undefined)
    {
      const drawedLine: DrawedLine = {
        ...line,
        player: this.selectedPlayer
      };
      this.allDrawedLines.push(drawedLine);

      this.lineStyles[line.order].backgroundColor = this.selectedPlayer.color;

      this.checkAndDrawSquare(drawedLine);
    }

    this.clickedDot1 = null;
    this.clickedDot2 = null;
  }

  checkAndDrawSquare(drawedLine: DrawedLine): void
  {
    let atleastOneSquareDrawed = false;

    const squares = drawedLine.squares;

    squares.forEach(square =>
    {
      const other3Lines = square.lines.filter(line => line.order !== drawedLine.order);

      if (other3Lines.every(line => this.allDrawedLines.find(drawedLine => drawedLine.order === line.order)))
      {
        const drawedsquare: DrawedSquare = {
          ...square,
          team: this.selectedPlayer.team
        };

        this.allDrawedSquares.push(drawedsquare);

        this.squareStyles[square.order] = {
          backgroundColor: this.selectedPlayer.color
        };

        atleastOneSquareDrawed = true;
        this.calculateScores();
      }
    });

    if (!atleastOneSquareDrawed)
    {
      if (this.selectedPlayer.id === this.player1.id)
      {
        this.selectedPlayer = this.player2;
      } else
      {
        this.selectedPlayer = this.player1;
      }
    }
  }

  calculateScores(): void
  {
    this.score[this.selectedPlayer.id]++;
  }

  ngOnInit(): void
  {

    this.numberOfColumns = this.dataStoreHelper.getNumberOfColumns();
    this.numberOfRows = this.dataStoreHelper.getNumberOfRows();

    const player1 = new Player();
    player1.id = this.idGenerator();
    player1.name = this.dataStoreHelper.getPlayer1Name();
    player1.color = 'blue';
    player1.team = new Team();

    const player2 = new Player();
    player2.id = this.idGenerator();
    player2.name = this.dataStoreHelper.getPlayer2Name();
    player2.color = 'red';
    player2.team = new Team();

    this.player1 = player1;
    this.player2 = player2;
    this.selectedPlayer = player1;

    this.score = {
      [player1.id]: 0,
      [player2.id]: 0
    };

    const allDots: Dot[] = [];

    const allLines: Line[] = [];

    const allSquares: Square[] = [];

    for (let i = 1; i <= this.numberOfRows; i++)
    {
      for (let j = 1; j <= this.numberOfColumns; j++)
      {
        const order = (i - 1) * this.numberOfColumns + j;

        let dot = allDots.find(dot => dot.order === order);

        const isDotNew: boolean = dot === undefined;

        if (dot === undefined)
        {
          dot = new Dot();
          dot.order = order;
          dot.id = this.idGenerator();
        }

        if (i === 1)
        {
          dot.top = null;
        }

        if (i === this.numberOfRows)
        {
          dot.bottom = null;
        } else if (dot.bottom === undefined)
        {
          const bottomDotOrder = dot.order + this.numberOfColumns;

          let bottomDot = allDots.find(dot => dot.order === bottomDotOrder);

          if (bottomDot === undefined)
          {
            bottomDot = new Dot();
            bottomDot.order = bottomDotOrder;
            bottomDot.id = this.idGenerator();
            dot.bottom = bottomDot;
            bottomDot.top = dot;
            allDots.push(bottomDot);
          } else
          {
            dot.bottom = bottomDot;
            bottomDot.top = dot;
          }

          allLines.push({
            id: this.idGenerator(),
            order: i * (this.numberOfColumns - 1) + Math.min(dot.order, bottomDot.order),
            dot1: dot,
            dot2: bottomDot,
            horizontal: false,
            vertical: true,
            squares: []
          });
        }

        if (j === 1)
        {
          dot.left = null;
        }

        if (j === this.numberOfColumns)
        {
          dot.right = null;
        } else if (dot.right === undefined)
        {
          const rightDotOrder = dot.order + 1;

          let rightDot = allDots.find(dot => dot.order === rightDotOrder);

          if (rightDot === undefined)
          {
            rightDot = new Dot();
            rightDot.order = rightDotOrder;
            rightDot.id = this.idGenerator();
            dot.right = rightDot;
            rightDot.left = dot;
            allDots.push(rightDot);
          } else
          {
            dot.right = rightDot;
            rightDot.left = dot;
          }

          allLines.push({
            id: this.idGenerator(),
            order: (i - 1) * (this.numberOfColumns - 1) + Math.min(dot.order, rightDot.order),
            dot1: dot,
            dot2: rightDot,
            horizontal: true,
            vertical: false,
            squares: []
          });
        }

        if (isDotNew)
        {
          allDots.push(dot);
        }
      }
    }

    allLines.sort((a, b) => a.order - b.order);

    this.allLines = allLines;

    allLines.forEach(line =>
    {
      this.lineStyles[line.order] = {
        backgroundColor: '#efdada' // gray
      };
    });

    let start = 0;
    let end = 0;

    for (let row = 1; row <= 2 * this.numberOfRows - 1; row++)
    {
      start = end;
      end = row % 2 === 0 ? start + this.numberOfColumns : start + this.numberOfColumns - 1;

      this.displayLines.push(allLines.slice(start, end));
    }

    for (let i = 1; i <= this.numberOfRows - 1; i++)
    {
      for (let j = 1; j <= this.numberOfColumns - 1; j++)
      {
        const dot1Order = (i - 1) * this.numberOfColumns + j;
        const dot2Order = (i - 1) * this.numberOfColumns + j + 1;
        const dot3Order = (i - 1) * this.numberOfColumns + j + this.numberOfColumns;
        const dot4Order = (i - 1) * this.numberOfColumns + j + this.numberOfColumns + 1;

        const order = (i - 1) * (this.numberOfColumns - 1) + j;

        const dots = [
          allDots.find(dot => dot.order === dot1Order)!,
          allDots.find(dot => dot.order === dot2Order)!,
          allDots.find(dot => dot.order === dot3Order)!,
          allDots.find(dot => dot.order === dot4Order)!
        ];

        const square = new Square();
        square.id = this.idGenerator();
        square.order = order;
        square.dots = dots;

        const line1 = allLines.find(
          line =>
            (line.dot1.order === dot1Order && line.dot2.order === dot2Order) ||
            (line.dot1.order === dot2Order && line.dot2.order === dot1Order)
        )!;
        line1.squares.push(square);

        const line2 = allLines.find(
          line =>
            (line.dot1.order === dot1Order && line.dot2.order === dot3Order) ||
            (line.dot1.order === dot3Order && line.dot2.order === dot1Order)
        )!;
        line2.squares.push(square);

        const line3 = allLines.find(
          line =>
            (line.dot1.order === dot3Order && line.dot2.order === dot4Order) ||
            (line.dot1.order === dot4Order && line.dot2.order === dot3Order)
        )!;
        line3.squares.push(square);

        const line4 = allLines.find(
          line =>
            (line.dot1.order === dot4Order && line.dot2.order === dot2Order) ||
            (line.dot1.order === dot2Order && line.dot2.order === dot4Order)
        )!;
        line4.squares.push(square);

        const lines = [
          line1,
          line2,
          line3,
          line4
        ];

        square.lines = lines;

        allSquares.push(square);
      }
    }
    this.allSquares = allSquares;
  }

  idGenerator(): number
  {
    return new Date().getTime() + (Math.random() * 100);
  }
}

