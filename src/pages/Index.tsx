
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, FileSpreadsheet, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Legends of Runeterra
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Companion App</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master your matches and monthly challenges with comprehensive mutator strategies, 
            champion databases, and powerful tracking tools.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:bg-card/80 transition-colors border-purple-500/20">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Mutators Database</CardTitle>
              <CardDescription>
                Complete mutator information with strategies and champion recommendations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-blue-500/20">
            <CardHeader className="text-center">
              <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Champion Tracker</CardTitle>
              <CardDescription>
                Track your champion collection and performance statistics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-green-500/20">
            <CardHeader className="text-center">
              <FileSpreadsheet className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Excel Import</CardTitle>
              <CardDescription>
                Import your data from Excel files for quick setup
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-orange-500/20">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-orange-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Account System</CardTitle>
              <CardDescription>
                Create an account to save and sync your progress
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Master Your Matches?</CardTitle>
              <CardDescription className="text-lg">
                Start with the Mutators Database to learn strategies for every encounter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/mutators">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3">
                  Explore Mutators Database
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
