import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";

import NavigationBar from "@/components/navigation-bar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Package, Country } from "@shared/schema";

export default function PurchaseScreen() {
  const [, params] = useRoute("/purchase/:packageId");
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const { toast } = useToast();
  const packageId = params?.packageId ? parseInt(params.packageId) : null;

  const { data: pkg } = useQuery<Package>({
    queryKey: ["/api/packages", packageId],
    enabled: !!packageId,
  });

  const { data: country } = useQuery<Country>({
    queryKey: ["/api/countries", pkg?.countryId],
    enabled: !!pkg?.countryId,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (data: { packageId: number; paymentMethod: string }) => {
      const response = await apiRequest("POST", "/api/purchase", data);
      if (!response.ok) {
        throw new Error(`Purchase failed: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Purchase successful, data:", data);
      toast({
        title: "Purchase Successful!",
        description: "Your eSIM has been created and is ready to install.",
      });
      // Add delay to ensure toast shows before navigation
      setTimeout(() => {
        console.log("Navigating to QR page:", `/qr/${data.esim.id}`);
        setLocation(`/qr/${data.esim.id}`);
      }, 1000);
    },
    onError: (error) => {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = () => {
    if (!packageId || !acceptedTerms) return;
    
    purchaseMutation.mutate({
      packageId,
      paymentMethod,
    });
  };

  if (!packageId || !pkg) {
    return <div>Package not found</div>;
  }

  const tax = parseFloat(pkg.price) * 0.2; // 20% tax
  const total = parseFloat(pkg.price) + tax;

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Purchase eSIM"
        showBack={true}
      />

      <div className="px-4 pt-4">
        {/* Package Summary */}
        <div className="mobile-card p-4 mb-4">
          <div className="flex items-center space-x-3 mb-3">
            {country && (
              <img 
                src={country.flagUrl} 
                alt={`${country.name} flag`} 
                className="w-8 h-6 rounded" 
              />
            )}
            <div>
              <p className="font-semibold">{country?.name}</p>
              <p className="text-sm text-muted-foreground">{pkg.name}</p>
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Package Price</span>
              <span className="font-semibold">€{pkg.price}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-semibold">€{tax.toFixed(2)}</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg text-primary">€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mobile-card p-4 mb-4">
          <h3 className="font-semibold mb-3">Payment Method</h3>
          <div className="space-y-3">
            <div 
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                paymentMethod === 'credit-card' ? 'border-primary bg-blue-50' : ''
              }`}
              onClick={() => setPaymentMethod('credit-card')}
            >
              <div className={`w-6 h-6 rounded-full border-2 ${
                paymentMethod === 'credit-card' ? 'border-primary bg-primary' : 'border-gray-300'
              } flex items-center justify-center`}>
                {paymentMethod === 'credit-card' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-medium">Credit Card</p>
                <p className="text-sm text-muted-foreground">•••• •••• •••• 1234</p>
              </div>
            </div>
            
            <div 
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                paymentMethod === 'paypal' ? 'border-primary bg-blue-50' : ''
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className={`w-6 h-6 rounded-full border-2 ${
                paymentMethod === 'paypal' ? 'border-primary bg-primary' : 'border-gray-300'
              } flex items-center justify-center`}>
                {paymentMethod === 'paypal' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-muted-foreground">Pay with PayPal account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mobile-card p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div 
              className={`w-5 h-5 mt-0.5 border-2 rounded cursor-pointer ${
                acceptedTerms ? 'border-primary bg-primary' : 'border-gray-300'
              } flex items-center justify-center`}
              onClick={() => setAcceptedTerms(!acceptedTerms)}
            >
              {acceptedTerms && (
                <span className="text-white text-xs">✓</span>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                I agree to the <span className="text-primary underline">Terms of Service</span> and{' '}
                <span className="text-primary underline">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <button 
          onClick={handlePurchase}
          disabled={!acceptedTerms || purchaseMutation.isPending}
          className={`w-full py-4 rounded-xl font-semibold mb-4 ${
            acceptedTerms && !purchaseMutation.isPending
              ? 'button-primary' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {purchaseMutation.isPending 
            ? 'Processing...' 
            : `Complete Purchase - €${total.toFixed(2)}`
          }
        </button>
        
        <div className="text-center text-sm text-muted-foreground pb-4">
          <p>Secure payment powered by Stripe</p>
          <p className="mt-1">🔒 Your payment information is protected</p>
        </div>
      </div>
    </div>
  );
}
