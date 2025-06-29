"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { addNotification } = useApp();

  const initialValues: ForgotPasswordFormValues = {
    email: "",
  };

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmittedEmail(values.email);
      setIsSuccess(true);

      addNotification({
        type: "success",
        title: "Reset link sent",
        message: `Password reset instructions have been sent to ${values.email}`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Failed to send reset link",
        message: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
            <CardHeader className="space-y-6 text-center pb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="/khabi-teq-logo.svg"
                    alt="Property Management"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Property Admin
                  </h1>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Check your email
                  </h2>
                  <p className="text-gray-600 mt-2">
                    We've sent a password reset link to
                  </p>
                  <p className="font-medium text-gray-900 bg-blue-50 py-2 px-3 rounded-lg mt-2">
                    {submittedEmail}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">What's next?</p>
                    <p className="text-blue-700 mt-1">
                      Click the link in your email to reset your password. The
                      link will expire in 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setSubmittedEmail("");
                  }}
                  variant="outline"
                  className="w-full h-11"
                >
                  Try different email
                </Button>

                <a href="/auth/login">
                  <Button
                    variant="ghost"
                    className="w-full h-11 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to sign in
                  </Button>
                </a>
              </div>

              <div className="text-center text-sm text-gray-600">
                Need help?{" "}
                <a
                  href="/contacts"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Contact support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
      {/* Overlay Preloader */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Sending reset link...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
          <CardHeader className="space-y-6 text-center pb-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="/khabi-teq-logo.svg"
                  alt="Property Management"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Property Admin
                </h1>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Forgot password?
              </h2>
              <p className="text-gray-600">
                Enter your email and we'll send you a reset link
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            <Formik
              initialValues={initialValues}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email address
                    </Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@example.com"
                      className={`h-11 ${
                        errors.email && touched.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.email && touched.email ? (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.email}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Enter the email address associated with your account
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl"
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Send reset link</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Security Notice:</strong> Reset links expire after 24
                hours and can only be used once.
              </p>
            </div>

            <div className="text-center">
              <a href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to sign in
                </Button>
              </a>
            </div>

            <div className="text-center text-sm text-gray-600">
              Need immediate help?{" "}
              <a
                href="/contacts"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contact support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
