export interface CreateOrderSatisfactionRequest {
  token: string;
  score: number;
  comment?: string;
}
