"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/schema/schema";
import Link from "next/link";
import { toast } from "sonner";

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // 🔐 Handle Form Submission
  const onSubmit = async (values: LoginSchema) => {
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      toast.error('Invalid email or password')
    } else {
      await getSession()
      toast.success('Redirecting...')
      router.push("/dashboard/profile");
    }
  };

  // 🧪 Demo Credentials
  const demoCredentials = [
    { email: "admin@upnd.zm", role: "admin", name: "Hakainde Hichilema" },
    { email: "provinceadmin@upnd.zm", role: "provinceadmin", name: "Cornelius Mweetwa" },
    { email: "districtadmin@upnd.zm", role: "districtadmin", name: "Mutale Nalumango" },
    { email: "wardadmin@upnd.zm", role: "wardadmin", name: "Sylvia Mweetwa" },
    { email: "branchadmin@upnd.zm", role: "branchadmin", name: "Jack Mwiimbu" },
    { email: "sectionadmin@upnd.zm", role: "sectionadmin", name: "Peter Sinkamba" },
    { email: "member@upnd.zm", role: "member", name: "John Doe" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-upnd-red via-upnd-red-dark to-upnd-yellow flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-2 shadow-lg">
            <Link href='/'>
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-full h-full object-contain"
            /></Link>
          </div>
          <h1 className="text-2xl font-bold text-upnd-black mb-2">
            UPND Admin Portal
          </h1>
          <p className="text-upnd-yellow font-medium">
            Unity, Work, Progress
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-upnd-red transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-upnd-red to-upnd-yellow text-white hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? "Signing In..." : "Sign In to UPND Portal"}
            </Button>
          </form>
        </Form>

        {/* Demo Credentials */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-upnd-black mb-4 text-center">
            Demo Accounts
          </h3>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() =>{
                  form.setValue("email", cred.email);
                  form.setValue("password", "upnd2024");}
                }
                className="w-full text-left p-3 bg-gray-50 hover:bg-upnd-red-light/10 rounded-lg transition-colors text-sm"
              >
                <div className="font-medium text-upnd-black">{cred.name}</div>
                <div className="text-gray-600">
                  {cred.role} - {cred.email}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Password for all demo accounts:{" "}
            <span className="font-mono">upnd2024</span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            UPND Membership Management Platform
          </p>
          <p className="text-xs text-upnd-red font-medium mt-1">
            For authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
