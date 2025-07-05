import { useState } from "react";
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

// 플랜 타입 정의
type PlanType = "free" | "pro";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
  current?: boolean;
}

const AdminBilling = () => {
  const { user } = useAuthStore();
  const [currentPlan, setCurrentPlan] = useState<PlanType>(
    (user?.profile.plan as PlanType) || "free",
  );
  const [loading, setLoading] = useState<PlanType | null>(null);

  // 플랜 데이터
  const plans: Plan[] = [
    {
      id: "free",
      name: "Free Plan",
      price: "0 SUI",
      description: "Suitable for individual users and small projects",
      current: currentPlan === "free",
      features: [
        { name: "Up to 3 Projects", included: true },
        { name: "Basic mission system", included: true },
        { name: "Community support", included: true },
        { name: "API access (limited)", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
      ],
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "100 SUI",
      description: "For businesses and users who need advanced features",
      recommended: true,
      current: currentPlan === "pro",
      features: [
        { name: "Unlimited Projects", included: true },
        { name: "Advanced mission system", included: true },
        { name: "Priority support", included: true },
        { name: "Full API access", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "White labeling", included: true },
        { name: "Custom branding", included: true },
      ],
    },
  ];

  const handlePlanChange = async (planId: PlanType) => {
    if (planId === currentPlan) return;

    setLoading(planId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentPlan(planId);
    } catch (error) {
      console.error("Error changing plan:", error);
    } finally {
      setLoading(null);
    }
  };

  const getCurrentPlanInfo = () => {
    return plans.find((plan) => plan.current);
  };

  const formatFeatures = (features: PlanFeature[]) => {
    return features.map((feature, index) => (
      <li
        key={index}
        className={`flex items-center gap-3 text-sm ${
          feature.included ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <div
          className={`flex-shrink-0 rounded-full p-1 ${
            feature.included ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
          }`}
        >
          <Check className="h-3 w-3" />
        </div>
        <span className={feature.included ? "" : "line-through"}>{feature.name}</span>
      </li>
    ));
  };

  return (
    <div className="flex h-full flex-col p-4 sm:p-6 lg:p-10">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and upgrade your subscription</p>
      </div>

      {/* 현재 플랜 정보 */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Current Plan
            </CardTitle>
            {getCurrentPlanInfo()?.recommended && (
              <Badge variant="default" className="bg-amber-100 text-amber-800">
                <Star className="mr-1 h-3 w-3" />
                Recommended
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold">{getCurrentPlanInfo()?.name}</h3>
              <p className="text-muted-foreground">{getCurrentPlanInfo()?.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {getCurrentPlanInfo()?.price}
                <span className="text-muted-foreground text-sm font-normal">/month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 플랜 선택 카드들 */}
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.current
                ? "shadow-lg ring-2 ring-blue-500"
                : plan.recommended
                  ? "shadow-lg ring-2 ring-amber-500"
                  : "transition-shadow hover:shadow-md"
            }`}
          >
            {/* 추천 배지 */}
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                <Badge className="bg-amber-500 text-white">
                  <Star className="mr-1 h-3 w-3" />
                  Recommended
                </Badge>
              </div>
            )}

            {/* 현재 플랜 배지 */}
            {plan.current && (
              <div className="absolute -top-3 right-4">
                <Badge className="bg-blue-500 text-white">Current Plan</Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                {plan.id === "pro" && <Crown className="h-6 w-6 text-amber-500" />}
              </div>
              <div className="text-3xl font-bold">
                {plan.price}
                <span className="text-muted-foreground text-sm font-normal">
                  {plan.price !== "₩0" && "/month"}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{plan.description}</p>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3">{formatFeatures(plan.features)}</ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handlePlanChange(plan.id)}
                disabled={plan.current || loading === plan.id}
                className={`h-11 w-full ${
                  plan.current
                    ? "cursor-not-allowed bg-gray-100 text-gray-500"
                    : plan.id === "pro"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                size="lg"
              >
                {loading === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    변경 중...
                  </div>
                ) : plan.current ? (
                  "Current Plan"
                ) : plan.id === "free" ? (
                  "Downgrade to Free"
                ) : (
                  "Upgrade to Pro"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminBilling;
