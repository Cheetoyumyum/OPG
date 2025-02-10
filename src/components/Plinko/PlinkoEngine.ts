import { binPayouts, RowCount } from "../../constants/game";
import type { RiskLevel } from "../../types/game";
import { getRandomBetween } from "../../utils/numbers";
import Matter, { type IBodyDefinition } from "matter-js";
import { v4 as uuidv4 } from "uuid";

type BallFrictionsByRowCount = {
  friction: NonNullable<IBodyDefinition["friction"]>;
  frictionAirByRowCount: Record<
    RowCount,
    NonNullable<IBodyDefinition["frictionAir"]>
  >;
};

/**
 * Engine for rendering the Plinko game using matter-js.
 */
class PlinkoEngine {
  private canvas: HTMLCanvasElement;
  private betAmount: number;
  private rowCount: RowCount;
  private riskLevel: RiskLevel;

  private engine: Matter.Engine;
  private render: Matter.Render;
  private runner: Matter.Runner;

  private pins: Matter.Body[] = [];
  private walls: Matter.Body[] = [];
  private sensor: Matter.Body;
  private pinsLastRowXCoords: number[] = [];

  static WIDTH = 760;
  static HEIGHT = 570;

  private static PADDING_X = 52;
  private static PADDING_TOP = 36;
  private static PADDING_BOTTOM = 28;

  private static PIN_CATEGORY = 0x0001;
  private static BALL_CATEGORY = 0x0002;

  private static ballFrictions: BallFrictionsByRowCount = {
    friction: 0.5,
    frictionAirByRowCount: {
      8: 0.0395,
      9: 0.041,
      10: 0.038,
      11: 0.0355,
      12: 0.0414,
      13: 0.0437,
      14: 0.0401,
      15: 0.0418,
      16: 0.0364,
    },
  };

  constructor(
    canvas: HTMLCanvasElement,
    initialState: {
      betAmount: number;
      rowCount: RowCount;
      riskLevel: RiskLevel;
    },
    private onWin: (record: any) => void
  ) {
    this.canvas = canvas;
    this.betAmount = initialState.betAmount;
    this.rowCount = initialState.rowCount;
    this.riskLevel = initialState.riskLevel;

    this.engine = Matter.Engine.create({
      timing: { timeScale: 1 },
    });

    this.render = Matter.Render.create({
      engine: this.engine,
      canvas: this.canvas,
      options: {
        width: PlinkoEngine.WIDTH,
        height: PlinkoEngine.HEIGHT,
        background: "#0f1728",
        wireframes: false,
      },
    });

    this.runner = Matter.Runner.create();
    this.placePinsAndWalls();

    this.sensor = Matter.Bodies.rectangle(
      this.canvas.width / 2,
      this.canvas.height,
      this.canvas.width,
      10,
      {
        isSensor: true,
        isStatic: true,
        render: { visible: false },
      }
    );

    Matter.Composite.add(this.engine.world, [this.sensor]);
    Matter.Events.on(this.engine, "collisionStart", ({ pairs }) => {
      pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA === this.sensor) {
          this.handleBallEnterBin(bodyB);
        } else if (bodyB === this.sensor) {
          this.handleBallEnterBin(bodyA);
        }
      });
    });
  }

  start() {
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }

  stop() {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }

  dropBall() {
    const ballOffsetRangeX = this.pinDistanceX * 0.8;
    const ballRadius = this.pinRadius * 2;
    const { friction, frictionAirByRowCount } = PlinkoEngine.ballFrictions;

    const ball = Matter.Bodies.circle(
      getRandomBetween(
        this.canvas.width / 2 - ballOffsetRangeX,
        this.canvas.width / 2 + ballOffsetRangeX
      ),
      0,
      ballRadius,
      {
        restitution: 0.6,
        friction: 0.5,
        frictionAir: frictionAirByRowCount[this.rowCount] * 0.5,
        collisionFilter: {
          category: PlinkoEngine.BALL_CATEGORY,
          mask: PlinkoEngine.PIN_CATEGORY,
        },
        render: {
          fillStyle: "#ff0000",
        },
      }
    );

    Matter.Composite.add(this.engine.world, ball);
    return ball.id;
  }

  get binsWidthPercentage(): number {
    const lastPinX =
      this.pinsLastRowXCoords[this.pinsLastRowXCoords.length - 1];
    return (lastPinX - this.pinsLastRowXCoords[0]) / PlinkoEngine.WIDTH;
  }

  updateGameState(state: {
    rowCount?: RowCount;
    riskLevel?: RiskLevel;
    betAmount?: number;
  }) {
    if (state.rowCount && state.rowCount !== this.rowCount) {
      this.rowCount = state.rowCount;
      this.removeAllBalls();
      this.placePinsAndWalls();
    }
    if (state.riskLevel) this.riskLevel = state.riskLevel;
    if (state.betAmount) this.betAmount = state.betAmount;
  }

  private handleBallEnterBin(ball: Matter.Body) {
    const binIndex = this.pinsLastRowXCoords.findLastIndex(
      (pinX) => pinX < ball.position.x
    );

    if (binIndex !== -1 && binIndex < this.pinsLastRowXCoords.length - 1) {
      const multiplier = binPayouts[this.rowCount][this.riskLevel][binIndex];
      const payoutValue = this.betAmount * multiplier;
      const profit = payoutValue - this.betAmount;

      this.onWin({
        id: uuidv4(),
        betAmount: this.betAmount,
        rowCount: this.rowCount,
        binIndex,
        payout: {
          multiplier,
          value: payoutValue,
        },
        profit,
      });
    }

    Matter.Composite.remove(this.engine.world, ball);
  }

  // ... Rest of the implementation remains the same as the original file
  // Including pinDistanceX, pinRadius, placePinsAndWalls, and removeAllBalls methods
  /**
   * Gets the horizontal distance between each pin's center point.
   */
  private get pinDistanceX(): number {
    const lastRowPinCount = 3 + this.rowCount - 1;
    return (
      (this.canvas.width - PlinkoEngine.PADDING_X * 2) / (lastRowPinCount - 1)
    );
  }

  private get pinRadius(): number {
    return (24 - this.rowCount) / 2;
  }

  /**
   * Renders the pins and walls. Previous ones are removed before rendering new ones.
   */
  private placePinsAndWalls() {
    const {
      PADDING_X,
      PADDING_TOP,
      PADDING_BOTTOM,
      PIN_CATEGORY,
      BALL_CATEGORY,
    } = PlinkoEngine;

    if (this.pins.length > 0) {
      Matter.Composite.remove(this.engine.world, this.pins);
      this.pins = [];
    }
    if (this.pinsLastRowXCoords.length > 0) {
      this.pinsLastRowXCoords = [];
    }
    if (this.walls.length > 0) {
      Matter.Composite.remove(this.engine.world, this.walls);
      this.walls = [];
    }

    for (let row = 0; row < this.rowCount; ++row) {
      const rowY =
        PADDING_TOP +
        ((this.canvas.height - PADDING_TOP - PADDING_BOTTOM) /
          (this.rowCount - 1)) *
          row;

      /** Horizontal distance between canvas left/right boundary and first/last pin of the row. */
      const rowPaddingX =
        PADDING_X + ((this.rowCount - 1 - row) * this.pinDistanceX) / 2;

      for (let col = 0; col < 3 + row; ++col) {
        const colX =
          rowPaddingX +
          ((this.canvas.width - rowPaddingX * 2) / (3 + row - 1)) * col;
        const pin = Matter.Bodies.circle(colX, rowY, this.pinRadius, {
          isStatic: true,
          render: {
            fillStyle: "#ffffff",
          },
          collisionFilter: {
            category: PIN_CATEGORY,
            mask: BALL_CATEGORY, // Collide with balls
          },
        });
        this.pins.push(pin);

        if (row === this.rowCount - 1) {
          this.pinsLastRowXCoords.push(colX);
        }
      }
    }
    Matter.Composite.add(this.engine.world, this.pins);

    const firstPinX = this.pins[0].position.x;
    const leftWallAngle = Math.atan2(
      firstPinX - this.pinsLastRowXCoords[0],
      this.canvas.height - PADDING_TOP - PADDING_BOTTOM
    );
    const leftWallX =
      firstPinX -
      (firstPinX - this.pinsLastRowXCoords[0]) / 2 -
      this.pinDistanceX * 0.25;

    const leftWall = Matter.Bodies.rectangle(
      leftWallX,
      this.canvas.height / 2,
      10,
      this.canvas.height,
      {
        isStatic: true,
        angle: leftWallAngle,
        render: { visible: false },
      }
    );
    const rightWall = Matter.Bodies.rectangle(
      this.canvas.width - leftWallX,
      this.canvas.height / 2,
      10,
      this.canvas.height,
      {
        isStatic: true,
        angle: -leftWallAngle,
        render: { visible: false },
      }
    );
    this.walls.push(leftWall, rightWall);
    Matter.Composite.add(this.engine.world, this.walls);
  }

  private removeAllBalls() {
    Matter.Composite.allBodies(this.engine.world).forEach((body) => {
      if (body.collisionFilter.category === PlinkoEngine.BALL_CATEGORY) {
        Matter.Composite.remove(this.engine.world, body);
      }
    });
    this.onWin({ betAmountOfExistingBalls: {} });
  }
}

export default PlinkoEngine;
