import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 text-sm">
            🚀 Next Generation Investment Platform
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Asian Private Equity
            <span className="block text-blue-600">Token Marketplace</span>
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Invest in real-world assets through blockchain technology. Access
            private equity opportunities with transparency, security, and
            liquidity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the future of private equity investment with
              cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <CardTitle className="text-xl">Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-slate-600">
                  Blockchain technology ensures complete transparency and
                  security for all transactions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle className="text-xl">Instant Liquidity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-slate-600">
                  Trade your private equity tokens instantly with our advanced
                  marketplace
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌏</span>
                </div>
                <CardTitle className="text-xl">Global Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-slate-600">
                  Access Asian private equity opportunities from anywhere in the
                  world
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already using our platform to
            access exclusive private equity opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white text-slate-900 hover:bg-slate-100"
            >
              Connect Wallet
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-slate-900"
            >
              View Products
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600 mb-4">
            © 2024 Asian Private Equity Token Marketplace. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built with ❤️ for the future of investment
          </p>
        </div>
      </footer>
    </div>
  );
}
