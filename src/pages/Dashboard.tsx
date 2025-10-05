import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, ShoppingCart, Package, LogOut } from "lucide-react";

export default function Dashboard() {
  const { profile, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Apply theme based on role
    if (userRole === 'farmer') {
      document.documentElement.classList.remove('theme-vendor');
      document.documentElement.classList.add('theme-farmer');
    } else if (userRole === 'vendor' || userRole === 'buyer') {
      document.documentElement.classList.remove('theme-farmer');
      document.documentElement.classList.add('theme-vendor');
    }
  }, [userRole]);

  const farmerActions = [
    {
      title: "My Inventory",
      description: "Manage your crops and inventory",
      icon: Leaf,
      path: "/inventory",
      color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/20",
    },
    {
      title: "My Orders",
      description: "View and manage orders",
      icon: Package,
      path: "/orders",
      color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
    },
    {
      title: "AI Insights",
      description: "Price trends and recommendations",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: "/insights",
      color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20",
    },
    {
      title: "Support",
      description: "Get help and report issues",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: "/support",
      color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20",
    },
  ];

  const vendorActions = [
    {
      title: "Marketplace",
      description: "Browse and order crops",
      icon: ShoppingCart,
      path: "/marketplace",
      color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
    },
    {
      title: "My Orders",
      description: "Track your purchases",
      icon: Package,
      path: "/orders",
      color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/20",
    },
    {
      title: "AI Insights",
      description: "Market trends and analytics",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: "/insights",
      color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20",
    },
    {
      title: "Support",
      description: "Get help and support",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: "/support",
      color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20",
    },
  ];

  const actions = userRole === 'farmer' ? farmerActions : vendorActions;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Uzhavar Nanban</h1>
            <p className="text-sm text-muted-foreground">
              {profile?.full_name} • {userRole?.charAt(0).toUpperCase()}{userRole?.slice(1)}
            </p>
          </div>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name}!
          </h2>
          <p className="text-muted-foreground">
            {userRole === 'farmer' 
              ? 'Manage your crops and orders from your dashboard'
              : 'Discover fresh produce and place orders'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`${action.color} border rounded-lg p-6 text-left transition-all duration-200 hover-scale`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-background">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}