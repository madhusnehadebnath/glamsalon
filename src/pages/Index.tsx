import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Clock, Award, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-salon.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Scissors,
      title: "Expert Stylists",
      description: "Professional team with years of experience",
    },
    {
      icon: Clock,
      title: "Easy Booking",
      description: "Book appointments 24/7 at your convenience",
    },
    {
      icon: Award,
      title: "Premium Services",
      description: "High-quality beauty and wellness treatments",
    },
    {
      icon: Star,
      title: "Top Rated",
      description: "Trusted by thousands of satisfied clients",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Your Beauty,{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Our Passion
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Experience luxury salon services with easy online booking. Choose from our wide range of beauty treatments and expert stylists.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/book")}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
                >
                  Book Appointment
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/services")}
                  className="border-primary/50 hover:bg-primary/5"
                >
                  View Services
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Luxury salon interior"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing exceptional beauty services in a relaxing and professional environment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-primary to-accent border-0 text-primary-foreground">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Transform Your Look?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Book your appointment today and experience the luxury you deserve.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/book")}
                className="bg-background text-foreground hover:bg-background/90 shadow-xl"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
