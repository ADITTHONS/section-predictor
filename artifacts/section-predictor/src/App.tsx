import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

function predictNextSection(rollNumber: number, currentSection: string, totalSections: number): string {
  const activeSections = SECTIONS.slice(0, totalSections);
  const currentIndex = activeSections.indexOf(currentSection);
  if (currentIndex === -1) return 'Unknown';
  
  const rollOffset = (rollNumber % totalSections);
  const nextIndex = (currentIndex + rollOffset + 1) % totalSections;
  return activeSections[nextIndex];
}

function SectionPredictor() {
  const [rollNumber, setRollNumber] = useState<string>("");
  const [currentSection, setCurrentSection] = useState<string>("");
  const [totalSections, setTotalSections] = useState<string>("4");
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    if (rollNumber && currentSection && totalSections) {
      const parsedRollNumber = parseInt(rollNumber, 10);
      if (!isNaN(parsedRollNumber)) {
        const result = predictNextSection(parsedRollNumber, currentSection, parseInt(totalSections, 10));
        setPrediction(result);
      } else {
        setPrediction(null);
      }
    } else {
      setPrediction(null);
    }
  }, [rollNumber, currentSection, totalSections]);

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground flex flex-col items-center py-12 px-4 md:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-12">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Class Section Predictor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Instantly determine your next class section assignment based on your university's rotation pattern.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Your Details</CardTitle>
                <CardDescription>Enter your current information to calculate the next section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="roll-number" className="text-sm font-semibold">Roll Number</Label>
                  <Input 
                    id="roll-number" 
                    type="number" 
                    placeholder="e.g. 1042" 
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="text-lg py-6"
                    data-testid="input-roll-number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-section" className="text-sm font-semibold">Current Section</Label>
                    <Select value={currentSection} onValueChange={setCurrentSection}>
                      <SelectTrigger id="current-section" className="py-6 text-lg" data-testid="select-current-section">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTIONS.map((sec) => (
                          <SelectItem key={sec} value={sec} data-testid={`option-current-section-${sec}`}>
                            Section {sec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="total-sections" className="text-sm font-semibold">Total Sections</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="max-w-[200px]">The total number of sections your batch is divided into for rotations.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={totalSections} onValueChange={setTotalSections}>
                      <SelectTrigger id="total-sections" className="py-6 text-lg" data-testid="select-total-sections">
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()} data-testid={`option-total-sections-${num}`}>
                            {num} Sections
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Prediction Result */}
          <div className="lg:col-span-5">
            <Card className="h-full border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5 overflow-hidden relative min-h-[300px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">Prediction Result</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center relative p-8">
                <AnimatePresence mode="wait">
                  {prediction ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex flex-col items-center text-center space-y-6 w-full"
                      data-testid="prediction-result"
                    >
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Next Assigned Section</p>
                        <div className="text-7xl md:text-8xl font-serif font-bold text-primary" data-testid="text-predicted-section">
                          {prediction}
                        </div>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-black/20 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/10 w-full max-w-[280px]">
                        <p className="text-sm font-medium text-primary flex items-center justify-center gap-2">
                          <Info className="w-4 h-4" />
                          Based on your roll number pattern
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center text-center space-y-4 max-w-[240px]"
                      data-testid="prediction-empty-state"
                    >
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <p className="text-muted-foreground">
                        Fill out your roll number and current section to see your prediction.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-xl">How it works</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                  <h3 className="font-semibold">Enter Roll Number</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Your roll number determines the offset used to shift your section assignment each semester.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                  <h3 className="font-semibold">Select Current Section</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">We use your current section as the baseline to calculate where you will be rotated to next.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                  <h3 className="font-semibold">Instant Prediction</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">The algorithm calculates your precise section based on the total number of sections in your batch.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SectionPredictor />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;