"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Mail,
  CheckCircle,
  Shield,
  Clock,
  AlertCircle,
  RotateCcw,
  HeadphonesIcon,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic email validation
    if (!email) {
      setError("Email address is required");
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg relative overflow-hidden">
            {/* Success gradient indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            
            <CardHeader className="space-y-8 pb-8 pt-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PropertyAdmin
                  </h1>
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
                  <p className="text-gray-600 text-lg mt-3">
                    We've sent a password reset link to
                  </p>
                  <p className="font-semibold text-gray-900 text-lg bg-blue-50 py-2 px-4 rounded-lg mt-2">
                    {email}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-8">
              <div className="space-y-5">
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 text-base">What's next?</p>
                      <p className="text-blue-800 mt-2 leading-relaxed">
                        Click the secure link in your email to create a new password. 
                        The link will expire in 24 hours for your security.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-900 text-base">
                        Didn't receive the email?
                      </p>
                      <p className="text-amber-800 mt-2 leading-relaxed">
                        Check your spam folder or wait a few minutes. Email delivery 
                        can sometimes take up to 5 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                    setError("");
                  }}
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  <RotateCcw className="h-5 w-5 mr-3" />
                  Try different email
                </Button>

                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full h-12 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                  >
                    <ArrowLeft className="h-5 w-5 mr-3" />
                    Back to sign in
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Still need help?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Information */}
        <div className="hidden lg:block space-y-10">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PropertyAdmin
                </h1>
                <p className="text-gray-600 font-medium">Advanced Management Platform</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Secure password
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  recovery process
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We'll help you regain access to your account quickly and securely 
                with our enterprise-grade recovery system.
              </p>
            </div>
          </div>

          {/* Enhanced Security Features */}
          <div className="space-y-5">
            <div className="group flex items-start space-x-5 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/80 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Secure Process</h3>
                <p className="text-gray-600 mt-1">
                  Your password reset is protected with military-grade encryption and secure tokens.
                </p>
              </div>
            </div>

            <div className="group flex items-start space-x-5 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/80 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Quick Recovery</h3>
                <p className="text-gray-600 mt-1">
                  Receive your secure reset link within minutes with our optimized delivery system.
                </p>
              </div>
            </div>

            <div className="group flex items-start space-x-5 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/80 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <HeadphonesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">24/7 Support</h3>
                <p className="text-gray-600 mt-1">
                  Our dedicated support team is available around the clock to assist you.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">< 2min</div>
              <div className="text-sm text-gray-600">Recovery Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {/* Right side - Reset Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
            
            <CardHeader className="space-y-8 pb-8 pt-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PropertyAdmin
                  </h1>
                </div>
              </div>

              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-gray-900">Forgot password?</h2>
                <p className="text-gray-600 text-lg">
                  Enter your email and we'll send you a secure reset link
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="admin@example.com"
                    className={`h-12 text-base transition-all duration-200 ${
                      error 
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {error ? (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Enter the email address associated with your admin account
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={isLoading || !email.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending reset link...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span>Send reset link</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="space-y-5">
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <Shield className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 text-base">Security Notice</p>
                      <p className="text-blue-800 mt-2 text-sm leading-relaxed">
                        Reset links are single-use and expire after 24 hours. 
                        We'll never ask for your password via email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                  >
                    <ArrowLeft className="h-5 w-5 mr-3" />
                    Back to sign in
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need immediate help?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}