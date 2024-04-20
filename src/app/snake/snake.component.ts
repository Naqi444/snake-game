import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css'],
})
export class SnakeComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  blockSize: number = 20;
  width: number = 20;
  height: number = 20;
  snake: Point[] = [];
  direction: Direction = Direction.Right;
  food: Point = { x: 0, y: 0 };
  score: number = 0;
  highscore: number = 0;
  gameIntervalId: any;

  constructor() {}

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.focus();
    this.initGame();
  }

  initGame(): void {
    this.snake = [];
    this.direction = Direction.Right;
    this.score = 0;
    this.createSnake();
    this.createFood();
    this.gameLoop();
  }

  createSnake(): void {
    const startLength = 5;
    for (let i = startLength - 1; i >= 0; i--) {
      this.snake.push({ x: i, y: 0 });
    }
  }

  createFood(): void {
    this.food = {
      x: Math.floor(Math.random() * this.width),
      y: Math.floor(Math.random() * this.height),
    };

    for (let i = 0; i < this.snake.length; i++) {
      if (this.food.x === this.snake[i].x && this.food.y === this.snake[i].y) {
        this.createFood();
        break;
      }
    }
  }

  gameLoop(): void {
    if (this.gameIntervalId) {
      clearInterval(this.gameIntervalId);
    }

    this.gameIntervalId = setInterval(() => {
      this.moveSnake();
      this.checkCollision();
      this.draw();
    }, 250);
  }

  moveSnake(): void {
    const head = { ...this.snake[0] };

    switch (this.direction) {
      case Direction.Up:
        head.y -= 1;
        break;
      case Direction.Down:
        head.y += 1;
        break;
      case Direction.Left:
        head.x -= 1;
        break;
      case Direction.Right:
        head.x += 1;
        break;
    }

    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 1;
      this.createFood();
    } else {
      this.snake.pop();
    }
  }

  checkCollision(): void {
    const head = this.snake[0];
    if (
      head.x < 0 ||
      head.x >= this.width ||
      head.y < 0 ||
      head.y >= this.height ||
      this.snake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      alert('Game Over');
      this.initGame();
    }
  }

  drawSnake(): void {
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    this.context.fillStyle = 'green';
    for (let i = 0; i < this.snake.length; i++) {
      this.context.fillRect(
        this.snake[i].x * this.blockSize,
        this.snake[i].y * this.blockSize,
        this.blockSize,
        this.blockSize
      );
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 1;
      this.context.strokeRect(
        this.snake[i].x * this.blockSize,
        this.snake[i].y * this.blockSize,
        this.blockSize,
        this.blockSize
      );
    }
  }

  drawFood(): void {
    this.context.fillStyle = 'red';
    this.context.fillRect(
      this.food.x * this.blockSize,
      this.food.y * this.blockSize,
      this.blockSize,
      this.blockSize
    );
  }

  draw(): void {
    this.drawSnake();
    this.drawFood();
  }

  @HostListener('document: keydown', ['$event'])
  handleKeyBoardEvent(event: KeyboardEvent): void {
    const key = event.key;
    switch (key) {
      case 'ArrowUp':
        if (this.direction !== Direction.Down) {
          this.direction = Direction.Up;
        }
        break;
      case 'ArrowDown':
        if (this.direction !== Direction.Up) {
          this.direction = Direction.Down;
        }
        break;
      case 'ArrowLeft':
        if (this.direction !== Direction.Right) {
          this.direction = Direction.Left;
        }
      case 'ArrowRight':
        if (this.direction !== Direction.Left) {
          this.direction = Direction.Right;
        }
        break;
    }
  }

  onReset() {
    this.initGame();
  }
}
