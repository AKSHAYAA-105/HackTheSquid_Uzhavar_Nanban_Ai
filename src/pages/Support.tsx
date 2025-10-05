import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, AlertCircle, Bot } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate report submission
    setTimeout(() => {
      toast({
        title: 'Report Submitted',
        description: 'Our support team will contact you soon.',
      });
      setLoading(false);
      setIssueType('');
      setDescription('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto py-4 px-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Support & Help</h1>
            <p className="text-sm text-muted-foreground">{profile?.full_name}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 space-y-6">
        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Call Support</h3>
                <p className="text-sm text-muted-foreground">1800-XXX-XXXX</p>
              </div>
              <Button className="w-full">Call Now</Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Chat with us</p>
              </div>
              <Button className="w-full" variant="outline">
                Open WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
                <Bot className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">AI Chatbot</h3>
                <p className="text-sm text-muted-foreground">Instant help</p>
              </div>
              <Button className="w-full" variant="outline">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Issue Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <CardTitle>Report an Issue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Type</label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="delivery">Delivery Problem</SelectItem>
                    <SelectItem value="produce">Produce Quality</SelectItem>
                    <SelectItem value="order">Order Issue</SelectItem>
                    <SelectItem value="technical">Technical Problem</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="min-h-32 text-base"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg" 
                disabled={loading || !issueType}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">How do I track my delivery?</h4>
              <p className="text-sm text-muted-foreground">
                Go to Orders and click on the order you want to track. Click "Track Delivery" to see real-time location.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">What if I have a payment dispute?</h4>
              <p className="text-sm text-muted-foreground">
                Report the issue using the form above or call our support team. We'll resolve it within 24 hours.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">How do I change my crop prices?</h4>
              <p className="text-sm text-muted-foreground">
                Go to your Inventory, select the crop, and click "Update Price" to modify pricing.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
