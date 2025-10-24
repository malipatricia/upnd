'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, AlertCircle, CheckCircle, X, InfoIcon } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { registerMember } from "@/server/server.actions"; // your server action
import { zambianProvinces, provincialDistricts } from "@/data/zambia";
import { EyeOff } from "lucide-react";
import { useForm } from 'react-hook-form';
import { addMemberSchema } from '@/schema/schema';
import { Endorsement } from '@/types';
import { DatePicker } from '@/services/date';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '../ui/label';
import { toast } from 'sonner';

export default function RegistrationForm() {
  const [showPass, setShowPass] = React.useState(false);
  const [province, setProvince] = React.useState("");
  const [id, setId] = React.useState("");
  const [buttonText, setButtonText] = React.useState("Submit UPND Membership Application");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      nrcNumber: "",
      dateOfBirth: new Date(),
      phone: "",
      province: "",
      district: "",
      constituency: "",
      membershipId: 'UPND',
      ward: "",
      branch: "",
      section: "",
      role: "member",
      userId: id,
      endorsements: [
      { endorserName: '', membershipId: '', endorsementDate: new Date },
      { endorserName: '', membershipId: '', endorsementDate: new Date }
    ] as Endorsement[],
    acceptConstitution: false
    },
  });

  // watch for zod validation errors
  useEffect(() => {
    if (!mounted) return;

    const errors = form.formState.errors;
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      // Collect the first few field names for readability
      const firstFew = Object.keys(errors).slice(0, 3).join(", ");
      toast.error(
        `Please correct ${firstFew}${Object.keys(errors).length > 3 ? "..." : ""}`
      );
    }
  }, [mounted, form.formState.errors]);

  async function onSubmit(values: z.infer<typeof addMemberSchema>) {
    // generate membership ID
    // UPND1761134814927
    const mid = 'UPND'+ Math.floor(100000000000 + Math.random() * 900000000000)
    values.membershipId = mid

    setButtonText('Registering...')
    try {
      const res = await registerMember(values);

      if (res?.error) {
        console.log(res.error)
        toast.error(`Error: ${res.error}`);
        form.setError("root", { message: res.error });
        setButtonText('Unsuccessful')
      } else {
        toast.success('Registration successful');
        setButtonText('Successful')
        const id = res.memberId !== undefined?res.memberId:''
        router.push(`/register/success?memberId=${encodeURIComponent(id)}`)
      }
    } catch (err) {
      console.error(err);
      form.setError("root", { message: "Registration failed." });
      setButtonText('Server Error')
    }
  }

  const districts = province ? provincialDistricts[province] || [] : [];

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-upnd-red transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
                alt="UPND Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-upnd-black">UPND Membership Registration</h1>
                <p className="text-sm text-upnd-yellow font-medium">Unity, Work, Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-upnd-red-light/10 border border-upnd-red-light/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-upnd-red" />
              <span className="font-semibold text-upnd-black">FREE Membership Registration</span>
            </div>
            <p className="text-sm text-gray-600">
              Join the United Party for National Development at no cost. Your commitment to Unity, Work, and Progress is all that's required.
            </p>
          </div>
        </div>

        <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-upnd-black mb-6 border-b border-gray-200 pb-3">
              Personal Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Legal Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Mwale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>

              <div>
                <FormField
              control={form.control}
              name="nrcNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NRC Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="123456/78/9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                      <FormItem className='flex flex-col space-y-4'>
                        <FormLabel>Date of Birth *</FormLabel>
                      <FormControl
                      >
                          <DatePicker field={field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>

              <div>
                <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="+260..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>

              <div>
                <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@upnd.zm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>

              <div className="md:col-span-2">
                <FormField
              control={form.control}
              name="residentialAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residential Address *</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter your full residential address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>
            </div>
          </div>
          {/* Passwords */}
          <div className="bg-white rounded-xl shadow-lg p-6 my-8">
            <h2 className="text-2xl font-bold text-upnd-black mb-4">
              Secure your account
            </h2>
            
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="pass"
                      type={showPass ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            onClick={() => setShowPass((p) => !p)}
            className="cursor-pointer mt-2 flex items-center text-sm text-muted-foreground"
          >
            <EyeOff size={16} className="mr-1" /> Toggle password
          </div>
            </div>
          </div>

          {/* Jurisdiction Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-upnd-black mb-6 border-b border-gray-200 pb-3">
              Administrative Jurisdiction
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setProvince(val);
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {zambianProvinces.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="constituency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Constituency *</FormLabel>
                      <FormControl>
                        <Input placeholder="Constituency" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ward *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ward" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch *</FormLabel>
                      <FormControl>
                        <Input placeholder="Branch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section *</FormLabel>
                        <FormControl>
                          <Input placeholder="Section" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            </div>
          </div>

          {/* Member Endorsements */}
          <div className="bg-white rounded-xl shadow-lg p-6 my-8">
            <h2 className="text-2xl font-bold text-upnd-black mb-4">
              Member Endorsements (Optional)
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              If you know existing UPND members who can endorse your application, please provide their details below.
            </p>
            
            <div className="space-y-6">
              {form.getValues('endorsements')?.map((endorsement, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-upnd-black mb-3">
                    Endorser {index + 1}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name={`endorsements.${index}.endorserName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endorser Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Endorser Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name={`endorsements.${index}.membershipId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UPND Membership ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Membership ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                  control={form.control}
                  name={`endorsements.${index}.endorsementDate`}
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endorsement Date</FormLabel>
                      <FormControl
                      >
                          <DatePicker field={field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constitution Acceptance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-upnd-black mb-6 border-b border-gray-200 pb-3">
              UPND Constitution & Commitment
            </h2>
            
            <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-upnd-black mb-3">Our Core Values</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-upnd-red mb-2">Unity</h4>
                  <p className="text-gray-600">Bringing together all Zambians regardless of tribe, region, or background</p>
                </div>
                <div>
                  <h4 className="font-semibold text-upnd-red mb-2">Work</h4>
                  <p className="text-gray-600">Promoting hard work, entrepreneurship, and sustainable development</p>
                </div>
                <div>
                  <h4 className="font-semibold text-upnd-red mb-2">Progress</h4>
                  <p className="text-gray-600">Advancing progressive policies for social and economic transformation</p>
                </div>
              </div>
            </div>
            
            <div className="flex">  
                <FormField
                control={form.control}
                name="acceptConstitution"
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center'>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} />
                    <Label className='mx-5'>I hereby accept the UPND Constitution and commit myself to the principles of Unity, Work, and Progress. 
                    I pledge to uphold the values and objectives of the United Party for National Development. *</Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Submit */}
          <Button id="submit" className={buttonText=='Submit UPND Membership Application' || 'Unsuccessful'?'my-6 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white hover:shadow-xl transform hover:-translate-y-1' : 'bg-gray-400 my-6'} type="submit">
            {buttonText}
          </Button>

          {/* {form.formState.errors.root && (
            <div className="border border-destructive bg-destructive/20 text-destructive p-2 rounded-md flex">
              <X className='mx-5'/>
              {form.formState.errors.root.message}
            </div>
          )}
          {form.formState.isSubmitSuccessful && (
            <div className="border border-green-600 bg-green-600/20 text-green-600 p-2 text-center rounded-md flex">
              <CheckCircle className='mx-5'/>
              Member added successfully
            </div>
          )} */}

          {/* Submit Button */}
          <div className="text-center">
            {/* <button
              type="submit"
              disabled={isSubmitting}
              className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-upnd-red to-upnd-yellow text-white hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit UPND Membership Application'}
            </button> */}
            <p className="text-gray-600 text-sm mt-4">
              By submitting this form, you agree to join the UPND movement for Unity, Work, and Progress
            </p>
          </div>
        </form>
{/* 
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="mt-4 border border-red-300 flex rounded-md bg-red-50 p-2 text-sm text-red-600">
              <InfoIcon className='mx-5'/>
              <strong>Please check that all details are correct.</strong>
              <pre className="text-xs mt-1">
                {JSON.stringify(form.formState.errors, null, 2)}
              </pre>
            </div>
          )}
           */}
        </Form>
      </div>
    </div>
  );
}