export interface PurchasedPremiumPlan {
  id: string;
  brand: string;
  plan: string;
  subscription_stripe_id: string;
  active: boolean;
  cancel_at: Date;
  created: Date;
}
