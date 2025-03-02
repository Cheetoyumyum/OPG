export type GameResult = "win" | "lose" | "push" | "blackjack" | null;
export type PairType = "perfect" | "colored" | "mixed" | null;
export type ThreeCardPokerHand =
  | "suited-trips"
  | "straight-flush"
  | "three-of-a-kind"
  | "straight"
  | "flush"
  | null;

export interface HandState {
  cards: Array<{ suit: string; value: string }>;
  score: number;
  result: GameResult;
  payout: number;
  pairType: PairType;
  pairPayout: number;
  twentyOnePlus3Hand: ThreeCardPokerHand;
  twentyOnePlus3Payout: number;
}

export interface BlackjackState {
  playerHands: HandState[];
  currentHandIndex: number;
  dealerHand: Array<{ suit: string; value: string }>;
  dealerScore: number;
  hideSecondCard: boolean;
  isGameActive: boolean;
  showInsurance?: boolean;
  isSplit?: boolean;
}
