export interface BrandPremiumPlan {
  id: string;
  stripe_product_name: string;
  stripe_product_id: string;
  stripe_price_id: string;
  test_stripe_product_id: string;
  test_stripe_price_id: string;
  pagseguro_price: string;
}
