import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface Staff {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  profile_image: string;
  is_available: boolean;
}

interface Service {
  name: string;
}

interface StaffService {
  services: Service;
}

const Staff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffServices, setStaffServices] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select("*")
        .order("name", { ascending: true });

      if (staffError) throw staffError;

      const { data: servicesData, error: servicesError } = await supabase
        .from("staff_services")
        .select(`
          staff_id,
          services (name)
        `);

      if (servicesError) throw servicesError;

      const servicesByStaff: Record<string, string[]> = {};
      servicesData?.forEach((item: any) => {
        if (!servicesByStaff[item.staff_id]) {
          servicesByStaff[item.staff_id] = [];
        }
        servicesByStaff[item.staff_id].push(item.services.name);
      });

      setStaff(staffData || []);
      setStaffServices(servicesByStaff);
    } catch (error) {
      console.error("Error loading staff:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Meet Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Expert Team</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Skilled professionals dedicated to making you look and feel your best
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No team members available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="mx-auto">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage src={member.profile_image} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl">
                        <User className="h-16 w-16" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
                    <Badge variant={member.is_available ? "default" : "secondary"} className="mb-2">
                      {member.is_available ? "Available" : "Unavailable"}
                    </Badge>
                    <p className="text-sm font-medium text-primary">{member.specialization}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-left">{member.bio}</CardDescription>
                  
                  {staffServices[member.id] && staffServices[member.id].length > 0 && (
                    <div className="text-left">
                      <p className="text-sm font-semibold mb-2">Services Offered:</p>
                      <div className="flex flex-wrap gap-2">
                        {staffServices[member.id].map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
