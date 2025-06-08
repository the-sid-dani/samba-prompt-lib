import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Eye, ArrowRight } from "lucide-react";

export default function PerformanceTestPage() {
  return (
    <div className="min-h-screen bg-background transition-[background-color] duration-300 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Performance Test Lab
          </h1>
          <p className="text-muted-foreground">
            Compare original vs. optimized performance implementations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Implementation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Original Version
              </CardTitle>
              <CardDescription>
                Current production implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline">Standard SSR</Badge>
                <Badge variant="outline">Full Page Rendering</Badge>
                <Badge variant="outline">No Suspense</Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>• Loads everything at once</p>
                <p>• Higher Time to First Byte</p>
                <p>• All content waits for slowest data</p>
              </div>

              <Link href="/">
                <Button className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Test Original
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Optimized Implementation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Optimized Version
              </CardTitle>
              <CardDescription>
                Partial Prerendering + Suspense
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="default">Partial Prerendering</Badge>
                <Badge variant="default">Suspense Boundaries</Badge>
                <Badge variant="default">Static + Dynamic</Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>• Instant static content</p>
                <p>• Progressive enhancement</p>
                <p>• Optimized loading experience</p>
              </div>

              <Link href="/optimized">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Test Optimized
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics to Watch */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Performance Metrics</CardTitle>
            <CardDescription>
              What to measure when testing both versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-foreground">TTFB</h3>
                <p className="text-sm text-muted-foreground">Time to First Byte</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: &lt;200ms
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-foreground">LCP</h3>
                <p className="text-sm text-muted-foreground">Largest Contentful Paint</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: &lt;2.5s
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-foreground">FID</h3>
                <p className="text-sm text-muted-foreground">First Input Delay</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: &lt;100ms
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-foreground">CLS</h3>
                <p className="text-sm text-muted-foreground">Cumulative Layout Shift</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: &lt;0.1
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Open Browser DevTools</p>
                <p className="text-sm text-muted-foreground">F12 → Network tab → Disable cache</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Test Both Versions</p>
                <p className="text-sm text-muted-foreground">Compare load times and user experience</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Run Lighthouse</p>
                <p className="text-sm text-muted-foreground">DevTools → Lighthouse → Performance audit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline">
              <ArrowRight className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 