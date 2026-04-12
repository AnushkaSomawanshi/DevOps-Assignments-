import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Camera,
  CameraOff,
  Clock,
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  Phone,
  PhoneOff,
  Send,
  Shield,
  Star,
  Upload,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DEMO_MESSAGES = [
  {
    id: 1,
    sender: "doctor",
    text: "Good morning! How are you feeling today?",
    time: "10:01",
  },
  {
    id: 2,
    sender: "patient",
    text: "Morning Doctor! I have been having some discomfort since last week.",
    time: "10:02",
  },
  {
    id: 3,
    sender: "doctor",
    text: "I understand. Can you describe the symptoms in more detail?",
    time: "10:02",
  },
  {
    id: 4,
    sender: "patient",
    text: "Mild pelvic pain and irregular cycles this month.",
    time: "10:03",
  },
  {
    id: 5,
    sender: "doctor",
    text: "Thank you. I will recommend some tests after our consultation.",
    time: "10:04",
  },
];

const AVAILABLE_DOCTORS = [
  {
    id: "d1",
    name: "Dr. Anjali Kulkarni",
    speciality: "Senior Gynecologist",
    exp: "15 yrs",
    rating: 4.9,
    slots: ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
  },
  {
    id: "d2",
    name: "Dr. Priya Sharma",
    speciality: "Obs & Gynecology",
    exp: "12 yrs",
    rating: 4.8,
    slots: ["09:30 AM", "12:00 PM", "03:00 PM"],
  },
  {
    id: "d3",
    name: "Dr. Sunita Patil",
    speciality: "IVF & Infertility",
    exp: "18 yrs",
    rating: 5.0,
    slots: ["11:00 AM", "02:30 PM", "05:00 PM"],
  },
];

function CallTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <span className="font-mono text-sm text-primary font-semibold">
      {mm}:{ss}
    </span>
  );
}

export default function TeleconsultationPage() {
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [selectedDoctor, setSelectedDoctor] = useState(AVAILABLE_DOCTORS[0]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll-to-bottom on messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "patient",
        text: chatMsg.trim(),
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setChatMsg("");
  };

  if (inCall) {
    return (
      <Layout>
        <div className="bg-muted/40 py-6 border-b border-border">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div>
              <Badge variant="secondary" className="mb-1">
                Live Call
              </Badge>
              <h1 className="text-2xl font-bold font-display text-foreground">
                Video Consultation
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full border border-destructive/30">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <CallTimer />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video area */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Doctor video */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-border aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl font-bold text-primary">
                        AK
                      </span>
                    </div>
                    <p className="font-semibold text-foreground">
                      {selectedDoctor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedDoctor.speciality}
                    </p>
                  </div>
                  <Badge className="absolute top-3 left-3 text-xs bg-primary/90">
                    Doctor
                  </Badge>
                </div>
                {/* Patient video */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5 border border-border aspect-video flex items-center justify-center">
                  {cameraOff ? (
                    <div className="text-center">
                      <CameraOff className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Camera Off
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl font-bold text-accent">
                          ME
                        </span>
                      </div>
                      <p className="font-semibold text-foreground">
                        You (Patient)
                      </p>
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 text-xs bg-accent/90">
                    You
                  </Badge>
                  {muted && (
                    <div className="absolute top-3 right-3 bg-destructive/90 rounded-full p-1">
                      <MicOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Call controls */}
              <div className="flex items-center justify-center gap-3 bg-card border border-border rounded-2xl p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={`rounded-full h-12 w-12 ${muted ? "bg-destructive/10 border-destructive text-destructive" : ""}`}
                  onClick={() => {
                    setMuted((m) => !m);
                    toast.info(muted ? "Unmuted" : "Muted");
                  }}
                  aria-label={muted ? "Unmute" : "Mute"}
                  data-ocid="call-mute-btn"
                >
                  {muted ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={`rounded-full h-12 w-12 ${cameraOff ? "bg-destructive/10 border-destructive text-destructive" : ""}`}
                  onClick={() => {
                    setCameraOff((c) => !c);
                    toast.info(cameraOff ? "Camera on" : "Camera off");
                  }}
                  aria-label={cameraOff ? "Turn camera on" : "Turn camera off"}
                  data-ocid="call-camera-btn"
                >
                  {cameraOff ? (
                    <CameraOff className="h-5 w-5" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={() => toast.info("Screen sharing started")}
                  aria-label="Share screen"
                  data-ocid="call-screen-share-btn"
                >
                  <Monitor className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={() =>
                    toast.success("Prescription uploaded successfully")
                  }
                  aria-label="Upload prescription"
                  data-ocid="call-upload-btn"
                >
                  <Upload className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  className="rounded-full h-14 w-14 bg-destructive hover:bg-destructive/90 text-white"
                  onClick={() => {
                    setInCall(false);
                    toast.info("Call ended");
                  }}
                  aria-label="End call"
                  data-ocid="call-end-btn"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
              </div>

              {/* Doctor info */}
              <Card className="card-elevated">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary">AK</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">
                      {selectedDoctor.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDoctor.speciality} · {selectedDoctor.exp} exp
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-sm">
                      {selectedDoctor.rating}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat sidebar */}
            <div className="flex flex-col h-[580px] bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-2 bg-muted/30">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-semibold font-display">Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-0.5 ${msg.sender === "patient" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${
                        msg.sender === "patient"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {msg.time}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                  data-ocid="chat-input"
                />
                <Button
                  type="button"
                  size="icon"
                  className="btn-primary flex-shrink-0"
                  onClick={sendMessage}
                  aria-label="Send message"
                  data-ocid="chat-send-btn"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted/40 py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-3">
            Virtual Care
          </Badge>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Teleconsultation
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Consult our specialist gynecologists from the comfort of your home —
            secure, private, and convenient.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Video,
              title: "HD Video Call",
              desc: "Crystal-clear video with end-to-end encryption",
            },
            {
              icon: MessageSquare,
              title: "In-Call Chat",
              desc: "Text-based chat during consultation",
            },
            {
              icon: Shield,
              title: "100% Private",
              desc: "HIPAA-compliant encrypted sessions",
            },
            {
              icon: Calendar,
              title: "Flexible Slots",
              desc: "Book any slot, 7 days a week 7AM–9PM",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="card-elevated hover:shadow-hospital-lg transition-smooth"
            >
              <CardContent className="p-5 text-center">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold font-display mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Doctor selection + Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-display mb-6">
              Available Doctors
            </h2>
            <div className="space-y-4">
              {AVAILABLE_DOCTORS.map((doc) => (
                <Card
                  key={doc.id}
                  className={`card-elevated transition-smooth cursor-pointer ${selectedDoctor.id === doc.id ? "border-primary ring-2 ring-primary/20" : "hover:shadow-hospital-lg"}`}
                  onClick={() => setSelectedDoctor(doc)}
                  data-ocid={`doctor-card-${doc.id}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary">
                          {doc.name
                            .split(" ")
                            .slice(1)
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                          <h3 className="font-bold text-foreground">
                            {doc.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold text-sm">
                              {doc.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {doc.speciality} · {doc.exp} experience
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {doc.slots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              className="px-3 py-1 text-xs rounded-lg border border-border bg-muted hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success(
                                  `Slot ${slot} booked with ${doc.name}`,
                                );
                              }}
                              data-ocid="slot-btn"
                            >
                              <Clock className="h-3 w-3 inline mr-1" />
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Panel */}
          <div className="space-y-4">
            <Card className="card-elevated border-primary/30 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2">
                  Start a Demo Call
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Experience a simulated teleconsultation session with{" "}
                  {selectedDoctor.name}
                </p>
                <Button
                  type="button"
                  className="w-full btn-primary"
                  onClick={() => setInCall(true)}
                  data-ocid="start-call-btn"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Start Video Call
                </Button>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-5">
                <h3 className="font-semibold font-display mb-3">
                  Book an Appointment
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Prefer to schedule in advance? Book a teleconsultation slot.
                </p>
                <Link to="/book-appointment">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    data-ocid="tele-book-btn"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Teleconsultation
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="card-elevated bg-accent/5 border-accent/20">
              <CardContent className="p-5">
                <Phone className="h-6 w-6 text-accent mb-3" />
                <h3 className="font-semibold font-display mb-1">
                  Need Immediate Help?
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Our tele-helpline is available 24×7
                </p>
                <p className="font-bold text-accent text-lg">1800-200-4567</p>
                <p className="text-xs text-muted-foreground">
                  Toll-free · All days
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
