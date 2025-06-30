
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Trophy, Target } from "lucide-react";

const MonthlyChallenge = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Monthly Challenge
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your progress and optimize your monthly challenge strategies
            </p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader className="text-center">
              <Calendar className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Monthly Challenge Tracker</CardTitle>
              <CardDescription className="text-lg">
                This feature is coming soon! You'll be able to:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">Monitor your monthly challenge completion</p>
                </div>
                
                <div className="text-center">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Optimize Strategies</h3>
                  <p className="text-sm text-muted-foreground">Get recommendations for challenge completion</p>
                </div>
                
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Historical Data</h3>
                  <p className="text-sm text-muted-foreground">View past challenge performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MonthlyChallenge;
