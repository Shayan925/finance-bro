import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs } from "./ui/tabs";
import { Chrome } from 'lucide-react';
import { useState } from "react";

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (provider?: 'google' | 'github', email?: string, password?: string) => Promise<void>;
  isLoading?: boolean;
}

export function AuthenticationModal({
  isOpen,
  onClose,
  onSignIn,
  isLoading = false
}: AuthenticationModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(undefined, email, password);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] p-0">
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
            <div className="p-6 pt-8 pb-2">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {activeTab === "signup" ? "Create an account" : "Welcome back"}
                </DialogTitle>
                <DialogDescription className="pt-2">
                  {activeTab === "signup" 
                    ? "Enter your email below to create your account"
                    : "Enter your email below to sign in to your account"
                  }
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="px-6">
              <div className="grid gap-4">
                <Button variant="outline" onClick={() => onSignIn('google')} disabled={isLoading} className="px-6">
                  <Chrome className="mr-2 h-5 w-5" />
                  Continue with Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-[22%] border-t border-gray-300 dark:border-gray-600" />
                    <span className="bg-background px-4 text-xs uppercase text-muted-foreground">
                      Or continue with email
                    </span>
                    <span className="w-[23%] border-t border-gray-300 dark:border-gray-600" />
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full px-6" 
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Please wait...</span>
                      </div>
                    ) : (
                      activeTab === "signup" ? "Create account" : "Sign in"
                    )}
                  </Button>
                </form>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center text-sm text-muted-foreground">
                {activeTab === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      className="px-1 h-2 font-normal" 
                      onClick={() => setActiveTab("login")}
                    >
                      Sign in
                    </Button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="px-2 h-0 font-normal" 
                      onClick={() => setActiveTab("signup")}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>

              {activeTab === "signup" && (
                <p className="mt-4 text-xs text-center text-muted-foreground">
                  By clicking continue, you agree to our{" "}
                  <Button 
                    variant="link" 
                    className="px-1 h-0 text-xs font-normal" 
                    onClick={() => setShowTerms(true)}
                  >
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button 
                    variant="link" 
                    className="px-1 h-0 text-xs font-normal"
                    onClick={() => setShowPrivacy(true)}
                  >
                    Privacy Policy
                  </Button>
                </p>
              )}
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto bg-black border">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold">1. Service Description</h3>
            <p>FinanceBro AI provides AI-powered investment analysis and recommendations. Our service includes stock analysis, portfolio recommendations, and market insights.</p>

            <h3 className="font-semibold">2. User Responsibilities</h3>
            <p>Users must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information during registration</li>
              <li>Maintain the confidentiality of their account credentials</li>
              <li>Use the service for personal, non-commercial purposes only</li>
              <li>Not attempt to manipulate or abuse the service</li>
            </ul>

            <h3 className="font-semibold">3. Financial Disclaimer</h3>
            <p>The information provided through our service is for educational purposes only and should not be considered as financial advice. Users should consult with qualified financial advisors before making investment decisions.</p>

            <h3 className="font-semibold">4. Service Limitations</h3>
            <p>We strive to provide accurate information but cannot guarantee the accuracy of our AI-generated analysis. Market conditions change rapidly, and past performance does not indicate future results.</p>
          </div>
          <Button onClick={() => setShowTerms(false)} className="mt-4">Close</Button>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto bg-black border">
          <DialogHeader>
            <DialogTitle className="text-xl">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold">1. Data Collection</h3>
            <p>We collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (email, password)</li>
              <li>Investment preferences and profile data</li>
              <li>Usage data and interaction with our services</li>
              <li>Search queries and analysis requests</li>
            </ul>

            <h3 className="font-semibold">2. Data Usage</h3>
            <p>Your data is used to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide personalized investment analysis</li>
              <li>Improve our AI models and recommendations</li>
              <li>Send relevant notifications and updates</li>
              <li>Maintain and improve our services</li>
            </ul>

            <h3 className="font-semibold">3. Data Protection</h3>
            <p>We implement industry-standard security measures to protect your data. Your information is stored securely using encryption and is never shared with third parties without your consent.</p>

            <h3 className="font-semibold">4. User Rights</h3>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </div>
          <Button onClick={() => setShowPrivacy(false)} className="mt-4">Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
} 