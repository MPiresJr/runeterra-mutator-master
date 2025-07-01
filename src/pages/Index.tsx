
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Calendar, FileSpreadsheet } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <GlobalHeader />
      <div className="max-w-[95vw] mx-auto px-4 py-12 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Legends of Runeterra
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Companion App</p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Master your matches and monthly challenges with comprehensive mutator strategies, 
            champion databases, and powerful tracking tools.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link to="/mutators">
            <Card className="hover:bg-card/80 transition-all duration-300 border-purple-500/20 hover:border-purple-500/50 cursor-pointer h-full">
              <CardHeader className="text-center">
                <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-2xl">Mutators</CardTitle>
                <CardDescription className="text-base">
                  Complete mutator database with strategies and champion recommendations for every encounter
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/roster">
            <Card className="hover:bg-card/80 transition-all duration-300 border-blue-500/20 hover:border-blue-500/50 cursor-pointer h-full">
              <CardHeader className="text-center">
                <Database className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-2xl">Roster</CardTitle>
                <CardDescription className="text-base">
                  Manage your champion collection with detailed tracking and region-based filtering
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/monthly-challenge">
            <Card className="hover:bg-card/80 transition-all duration-300 border-orange-500/20 hover:border-orange-500/50 cursor-pointer h-full">
              <CardHeader className="text-center">
                <Calendar className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-2xl">Monthly Challenge</CardTitle>
                <CardDescription className="text-base">
                  Track your progress in monthly challenges and optimize your strategies
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:bg-card/80 transition-colors border-purple-500/20">
            <CardHeader className="text-center">
              <FileSpreadsheet className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Excel Integration</CardTitle>
              <CardDescription>
                Seamlessly import and export your data with Excel compatibility
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-blue-500/20">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Filtering</CardTitle>
              <CardDescription>
                Advanced filtering by region, level, and star power for precise management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-green-500/20">
            <CardHeader className="text-center">
              <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Progress Tracking</CardTitle>
              <CardDescription>
                Keep track of your champion unlocks and progression levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-orange-500/20">
            <CardHeader className="text-center">
              <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Auto Save</CardTitle>
              <CardDescription>
                Automatic data persistence with every action you perform
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
