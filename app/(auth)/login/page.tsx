"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Building,
  Shield,
  Smartphone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Zap,
  BarChart3,
} from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    // Basic form validation
    const newErrors = { email: "", password: "" };
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set mock auth token
      document.cookie = "auth-token=authenticated; path=/; max-age=86400";

      // Redirect to admin dashboard
      window.location.href = "/admin";
    } catch (error) {
      setErrors({ email: "", password: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding & Features */}
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
                <p className="text-gray-600 font-medium">
                  Advanced Management Platform
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Transform your property
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  management experience
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Streamline operations, boost productivity, and scale your real
                estate business with our comprehensive management platform.
              </p>
            </div>
          </div>

          {/* Enhanced Features */}
          <div className="space-y-5">
            <div className="group flex items-start space-x-5 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/80 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Bank-Grade Security
                </h3>
                <p className="text-gray-600 mt-1">
                  Enterprise-level encryption and multi-factor authentication
                  keep your data safe.
                </p>
              </div>
            </div>

            <div className="group flex items-start space-x-5 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/80 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 mt-1">
                  Optimized performance ensures instant responses across all
                  devices.
                </p>
              </div>
            </div>

            <div className="group flex items-start space-x-5 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white/80 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Smart Analytics
                </h3>
                <p className="text-gray-600 mt-1">
                  Advanced insights and reporting to optimize your business
                  operations.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">10k+</div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
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
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back
                </h2>
                <p className="text-gray-600 text-lg">
                  Access your admin dashboard
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="admin@example.com"
                      className={`h-12 text-base transition-all duration-200 ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className={`h-12 text-base pr-12 transition-all duration-200 ${
                          errors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.password}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          rememberMe: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-gray-700 cursor-pointer font-medium"
                    >
                      Remember me
                    </Label>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span>Sign in to dashboard</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                  disabled={isLoading}
                >
                  <Icons.google className="h-5 w-5 mr-3" />
                  <span className="font-medium">Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                  disabled={isLoading}
                >
                  <Icons.microsoft className="h-5 w-5 mr-3" />
                  <span className="font-medium">Microsoft</span>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need access?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Contact administrator
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-xl border border-white/40">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-900">Secure</p>
                <p className="text-xs text-gray-600 mt-1">
                  Bank-grade security
                </p>
              </div>
              <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-xl border border-white/40">
                <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-900">Mobile</p>
                <p className="text-xs text-gray-600 mt-1">Responsive design</p>
              </div>
              <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-xl border border-white/40">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-900">Analytics</p>
                <p className="text-xs text-gray-600 mt-1">Smart insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
