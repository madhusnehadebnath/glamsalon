import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";

const bookingSchema = z.object({
  service_id: z.string().uuid({ message: "Please select a service" }),
  staff_id: z.string().uuid({ message: "Please select a staff member" }),
  appointment_date: z.date({ required_error: "Please select a date" }),
  appointment_time: z.string().min(1, { message: "Please select a time" }),
  notes: z.string().max(500, { message: "Notes must be less than 500 characters" }).optional(),
});

const Book = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to book an appointment");
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    loadServices();
    loadStaff();

    const preSelectedService = searchParams.get("service");
    if (preSelectedService) {
      setSelectedService(preSelectedService);
    }
  }, [navigate, searchParams]);

  const loadServices = async () => {
    const { data } = await supabase.from("services").select("*").eq("is_active", true);
    setServices(data || []);
  };

  const loadStaff = async () => {
    const { data } = await supabase.from("staff").select("*").eq("is_available", true);
    setStaff(data || []);
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  ];

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const validated = bookingSchema.parse({
        service_id: selectedService,
        staff_id: selectedStaff,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes,
      });

      const service = services.find((s) => s.id === validated.service_id);

      const { error } = await supabase.from("appointments").insert({
        user_id: user.id,
        service_id: validated.service_id,
        staff_id: validated.staff_id,
        appointment_date: format(validated.appointment_date, "yyyy-MM-dd"),
        appointment_time: validated.appointment_time,
        total_price: service?.price || 0,
        notes: validated.notes || null,
      });

      if (error) throw error;

      toast.success("Appointment booked successfully!");
      navigate("/appointments");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to book appointment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Book an Appointment</CardTitle>
            <CardDescription>Select your preferred service, stylist, date and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price} ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff">Stylist / Technician</Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Select a staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                <CalendarIcon className="inline h-4 w-4 mr-2" />
                Select Date
              </Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special requests or preferences..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
              />
            </div>

            <Button
              onClick={handleBooking}
              disabled={loading || !selectedService || !selectedStaff || !selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-primary to-accent"
              size="lg"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Book;
