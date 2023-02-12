import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dot, DrawedLine, DrawedSquare, Line, Player, Square, Team } from '../../models';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent
{
  allDotsSubject: BehaviorSubject<Dot[]> = new BehaviorSubject<Dot[]>([]);

  allDots$ = this.allDotsSubject.asObservable();

  allSquares!: Square[];
  allDrawedSquares: DrawedSquare[] = [];

  clickedDot1: Dot | null = null;
  clickedDot2: Dot | null = null;
  allLines!: Line[];
  allDrawedLines: DrawedLine[] = [];

  displayLines: Line[][] = [];

  selectedPlayer!: Player;

  x = 7;
  y = 5;
  lineStyles: any = {};
  squareStyles: any = {};
  player1!: Player;
  player2!: Player;
  score: any;

  onClickDot(dot: Dot): void
  {
    console.log(dot);

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
    console.log(this.allDrawedLines);
  }

  checkAndDrawSquare(drawedLine: DrawedLine): void
  {
    let atleastOneSquareDrawed = false;

    const squares = drawedLine.squares;

    squares.forEach(square =>
    {
      // const findDrawedSquare = this.allDrawedSquares.find(drawedSquare => drawedSquare.order === square.order)
      // if (findDrawedSquare === undefined) {
      // }

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
    // const x = 4
    // const y = 3
    const x = 7;
    const y = 5;

    const player1 = new Player();
    player1.id = this.idGenerator();
    player1.name = 'Player 1';
    player1.color = 'blue';
    player1.team = new Team();

    const player2 = new Player();
    player2.id = this.idGenerator();
    player2.name = 'Player 2';
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

    for (let i = 1; i <= y; i++)
    {
      for (let j = 1; j <= x; j++)
      {
        const order = (i - 1) * x + j;

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
        } else if (dot.top === undefined)
        {
          const topDotOrder = dot.order - x;

          let topDot = allDots.find(dot => dot.order === topDotOrder);

          if (topDot === undefined)
          {
            topDot = new Dot();
            topDot.order = topDotOrder;
            topDot.id = this.idGenerator();
            dot.top = topDot;
            topDot.bottom = dot;
            allDots.push(topDot);
          } else
          {
            dot.top = topDot;
            topDot.bottom = dot;
          }

          allLines.push({
            id: this.idGenerator(),
            order: i * (x - 1) + Math.min(dot.order, topDot.order),
            dot1: dot,
            dot2: topDot,
            horizontal: false,
            vertical: true,
            squares: []
          });
        }

        if (i === y)
        {
          dot.bottom = null;
        } else if (dot.bottom === undefined)
        {
          const bottomDotOrder = dot.order + x;

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
            order: i * (x - 1) + Math.min(dot.order, bottomDot.order),
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
        } else if (dot.left === undefined)
        {
          const leftDotOrder = dot.order - 1;

          let leftDot = allDots.find(dot => dot.order === leftDotOrder);

          if (leftDot === undefined)
          {
            leftDot = new Dot();
            leftDot.order = leftDotOrder;
            leftDot.id = this.idGenerator();
            dot.left = leftDot;
            leftDot.right = dot;
            allDots.push(leftDot);
          } else
          {
            dot.left = leftDot;
            leftDot.right = dot;
          }

          allLines.push({
            id: this.idGenerator(),
            order: (i - 1) * (x - 1) + Math.min(dot.order, leftDot.order),
            dot1: leftDot,
            dot2: dot,
            horizontal: true,
            vertical: false,
            squares: []
          });
        }

        if (j === x)
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
            order: (i - 1) * (x - 1) + Math.min(dot.order, rightDot.order),
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

    console.log(allDots.sort((a, b) => a.order - b.order));
    this.allDotsSubject.next(allDots);

    console.log(allLines.sort((a, b) => a.order - b.order));
    this.allLines = allLines;

    allLines.forEach(line =>
    {
      this.lineStyles[line.order] = {
        backgroundColor: '#efdada' // gray
      };
    });

    let start = 0;
    let end = 0;

    for (let row = 1; row <= 2 * y - 1; row++)
    {
      start = end;
      end = row % 2 === 0 ? start + x : start + x - 1;

      this.displayLines.push(allLines.slice(start, end));
    }

    for (let i = 1; i <= y - 1; i++)
    {
      for (let j = 1; j <= x - 1; j++)
      {
        const dot1Order = (i - 1) * x + j;
        const dot2Order = (i - 1) * x + j + 1;
        const dot3Order = (i - 1) * x + j + x;
        const dot4Order = (i - 1) * x + j + x + 1;

        const order = (i - 1) * (x - 1) + j;

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
    console.log(allSquares);
    this.allSquares = allSquares;
  }

  idGenerator(): number
  {
    return new Date().getTime() + (Math.random() * 100);
  }
}

