export type GameResult = "win" | "lose" | "push" | "blackjack" | null;

export interface HandState {
  cards: Array<{ suit: string; value: string }>;
  score: number;
  result: GameResult;
  payout: number;
}

export interface BlackjackState {
  playerHands: HandState[];
  currentHandIndex: number;
  dealerHand: Array<{ suit: string; value: string }>;
  dealerScore: number;
  hideSecondCard: boolean;
  isGameActive: boolean;
}
