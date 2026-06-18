import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainHeader from "./components/MainHeader";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Community from "./pages/Community";
import AICoach from "./pages/AICoach";
import Events from "./pages/Events";
import Consultants from "./pages/Consultants";
import CourseDetail from "./pages/CourseDetail";
import Leaderboard from "./pages/Leaderboard";
import Certificates from "./pages/Certificates";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/courses"} component={Courses} />
      <Route path={"/community"} component={Community} />
      <Route path={"/ai-coach"} component={AICoach} />
      <Route path={"/events"} component={Events} />
      <Route path={"/consultants"} component={Consultants} />
      <Route path={"/course/:id"} component={CourseDetail} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      <Route path={"/certificates"} component={Certificates} />
      <Route path={"/quiz/:id"} component={Quiz} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <MainHeader />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
