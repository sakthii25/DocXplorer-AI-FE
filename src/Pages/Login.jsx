import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Code, Database, Search, Zap } from "lucide-react";


function Login() {
    const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    // const BASE_URL =  import.meta.env.VITE_API_BASE_URL;
    const BASE_URL = "http://0.0.0.0:8000"

    try {
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Welcome ${data.name}`);
        // You can now redirect or store session info
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "/home";
      } else {
        toast.error(data.detail || "Authentication failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and heading */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <Code className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">DocXplorerAI</h1>
          <p className="text-sm text-muted-foreground">
            Your intelligent documentation assistant
          </p>
        </div>

        {/* Main card */}
        <Card className="border-border/40 shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
          <CardContent className="p-6 pt-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-center">
                Welcome Back
              </h2>
              <p className="text-sm text-center text-muted-foreground">
                Sign in to continue exploring documentation with AI assistance
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3">
              <Feature icon={<Search className="h-4 w-4 text-primary" />} label="Smart Search" />
              <Feature icon={<Database className="h-4 w-4 text-primary" />} label="RAG-Powered" />
              <Feature icon={<Zap className="h-4 w-4 text-primary" />} label="Code Examples" />
            </div>

            {/* Login button */}
            <div className="pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Continue with
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => toast.error("Login Failed")}
                  useOneTap
                  shape="pill"
                  theme="filled_blue"
                  text="continue_with"
                  locale="en_US"
                />
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground pt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          DocXplorerAI — Intelligent documentation for developers
        </p>
      </div>
    </div>
  );
}

const Feature = ({ icon, label }) => (
    <div className="flex flex-col items-center text-center p-2">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

export default Login;