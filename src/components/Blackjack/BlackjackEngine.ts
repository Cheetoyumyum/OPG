export type Card = {
  suit: string;
  value: string;
  numericValue: number;
};

export type PairType = "perfect" | "colored" | "mixed" | null;

export type ThreeCardPokerHand =
  | "suited-trips"
  | "straight-flush"
  | "three-of-a-kind"
  | "straight"
  | "flush"
  | null;

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

  constructor(private numberOfDecks: number = 6) {
    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.deck = [];
    for (let d = 0; d < this.numberOfDecks; d++) {
      for (const suit of this.suits) {
        for (const value of this.values) {
          const numericValue = this.getNumericValue(value);
          this.deck.push({ suit, value, numericValue });
        }
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

    // Sum all cards, counting aces as 11 initially
    for (const card of cards) {
      sum += card.numericValue;
      if (card.value === "A") {
        aces += 1;
      }
    }

    // Convert aces from 11 to 1 as needed to avoid busting
    while (sum > 21 && aces > 0) {
      sum -= 10; // Convert one ace from 11 to 1
      aces -= 1;
    }

    return sum;
  }

  public isBlackjack(cards: Card[]): boolean {
    return cards.length === 2 && this.calculateHandValue(cards) === 21;
  }

  public checkPairType(cards: Card[]): PairType {
    if (cards.length !== 2) return null;

    const [card1, card2] = cards;
    if (card1.value !== card2.value) return null;

    // Perfect pair: same suit and value
    if (card1.suit === card2.suit) {
      return "perfect";
    }

    // Colored pair: same color (both red or both black)
    const isRed = (suit: string) => suit === "♥" || suit === "♦";
    if (isRed(card1.suit) === isRed(card2.suit)) {
      return "colored";
    }

    // Mixed pair: different colors but same value
    return "mixed";
  }

  public calculatePairPayout(pairType: PairType, betAmount: number): number {
    switch (pairType) {
      case "perfect":
        return betAmount * 25;
      case "colored":
        return betAmount * 12;
      case "mixed":
        return betAmount * 6;
      default:
        return 0;
    }
  }

  public check21Plus3(
    playerCards: Card[],
    dealerUpCard: Card
  ): ThreeCardPokerHand {
    if (playerCards.length !== 2) return null;

    const threeCards = [...playerCards, dealerUpCard];

    // Check for suited trips (same value and same suit)
    if (
      threeCards.every(
        (card) =>
          card.value === threeCards[0].value && card.suit === threeCards[0].suit
      )
    ) {
      return "suited-trips";
    }

    // Sort cards by value for easier straight detection
    const sortedValues = threeCards
      .map((card) => this.getNumericValue(card.value))
      .sort((a, b) => a - b);

    // Check for three of a kind
    if (threeCards.every((card) => card.value === threeCards[0].value)) {
      return "three-of-a-kind";
    }

    // Check for straight flush
    const isFlush = threeCards.every(
      (card) => card.suit === threeCards[0].suit
    );
    const isStraight =
      sortedValues[2] - sortedValues[1] === 1 &&
      sortedValues[1] - sortedValues[0] === 1;

    if (isFlush && isStraight) {
      return "straight-flush";
    }

    if (isFlush) {
      return "flush";
    }

    if (isStraight) {
      return "straight";
    }

    return null;
  }

  public calculate21Plus3Payout(
    hand: ThreeCardPokerHand,
    betAmount: number
  ): number {
    switch (hand) {
      case "suited-trips":
        return betAmount * 100;
      case "straight-flush":
        return betAmount * 40;
      case "three-of-a-kind":
        return betAmount * 30;
      case "straight":
        return betAmount * 10;
      case "flush":
        return betAmount * 5;
      default:
        return 0;
    }
  }

  public isPush(playerCard: Card, dealerCard: Card): boolean {
    return playerCard.value === dealerCard.value;
  }
}
