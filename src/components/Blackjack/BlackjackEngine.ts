export type Card = {
  suit: string;
  value: string;
  numericValue: number;
};

export class BlackjackGame {
  private deck: Card[] = [];
  private suits = ["♠", "♥", "♦", "♣"];
  private values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.deck = [];
    for (const suit of this.suits) {
      for (const value of this.values) {
        const numericValue = this.getNumericValue(value);
        this.deck.push({ suit, value, numericValue });
      }
    }
    this.shuffle();
  }

  private shuffle(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  public dealCard(): Card {
    if (this.deck.length === 0) {
      this.initializeDeck();
    }
    return this.deck.pop()!;
  }

  private getNumericValue(value: string): number {
    if (value === "A") return 11;
    if (["K", "Q", "J"].includes(value)) return 10;
    return parseInt(value);
  }

  public calculateHandValue(cards: Card[]): number {
    let sum = 0;
    let aces = 0;

    for (const card of cards) {
      if (card.value === "A") {
        aces += 1;
      }
      sum += card.numericValue;
    }

    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces -= 1;
    }

    return sum;
  }

  public isBlackjack(cards: Card[]): boolean {
    return cards.length === 2 && this.calculateHandValue(cards) === 21;
  }
}
