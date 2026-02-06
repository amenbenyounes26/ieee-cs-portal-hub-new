import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Send, Loader2, CheckCircle, Mail, Phone, GraduationCap } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitContactMessage } from "@/hooks/use-contact-messages";
import { useToast } from "@/hooks/use-toast";

export default function Join() {
  const { mutate: submitMessage, isPending } = useSubmitContactMessage();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    year: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `
New Join Request:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
University: ${formData.university}
Year: ${formData.year}

Reason for joining IEEE CS TEK-UP SBC:
${formData.reason}
    `;

    submitMessage({
      name: formData.name,
      email: formData.email,
      subject: "New IEEE CS TEK-UP SBC Join Request",
      message: message,
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", university: "", year: "", reason: "" });
        toast({
          title: "Application Submitted!",
          description: "We'll review your application and get back to you soon.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PublicLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Join IEEE CS TEK-UP SBC
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready to embark on a journey of innovation and growth? Join our community of tech enthusiasts and shape the future together.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-8"
            >
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for your interest in joining IEEE CS TEK-UP SBC. We'll review your application and get back to you soon.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Submit Another Application
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+216 XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University *</Label>
                      <Input
                        id="university"
                        placeholder="Your university"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year *</Label>
                    <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ING-1">ING-1</SelectItem>
                        <SelectItem value="ING-2">ING-2</SelectItem>
                        <SelectItem value="ING-3">ING-3</SelectItem>
                        <SelectItem value="ING-4">ING-4</SelectItem>
                        <SelectItem value="ING-5">ING-5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Why do you want to join IEEE CS TEK-UP SBC? *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Tell us about your motivation, interests, and what you hope to gain from joining our community..."
                      rows={6}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={isPending} className="w-full glow-primary">
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
