"use client";

// @ts-nocheck
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWalletStore } from "@/stores/walletStore";
import { saveUserRegistration, getUserRegistrationByWallet } from "@/data/registrations";

interface UserRegistrationForm {
  fullName: string;
  email: string;
  income: string;
  walletAddress: string;
}

export default function RegisterContainer() {
  const { selectedUser } = useWalletStore();
  const [formData, setFormData] = useState<UserRegistrationForm>({
    fullName: '',
    email: '',
    income: '',
    walletAddress: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<UserRegistrationForm>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  // ウォレットアドレスを自動入力と既存登録チェック
  useEffect(() => {
    if (selectedUser?.address) {
      setFormData((prev: UserRegistrationForm) => ({
        ...prev,
        walletAddress: selectedUser.address
      }));

      // 既存の登録をチェック
      const existingRegistration = getUserRegistrationByWallet(selectedUser.address);
      if (existingRegistration) {
        setIsAlreadyRegistered(true);
        setFormData({
          fullName: existingRegistration.fullName,
          email: existingRegistration.email,
          income: existingRegistration.income,
          walletAddress: existingRegistration.walletAddress
        });
      } else {
        setIsAlreadyRegistered(false);
      }
    }
  }, [selectedUser]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserRegistrationForm> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.income.trim()) {
      newErrors.income = 'Income information is required';
    }

    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = 'Wallet address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserRegistrationForm) => (
    e: any
  ) => {
    setFormData((prev: UserRegistrationForm) => ({
      ...prev,
      [field]: e.target.value
    }));

    // エラーをクリア
    if (errors[field]) {
      setErrors((prev: Partial<UserRegistrationForm>) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Clear previous messages
      setSuccessMessage('');
      setErrorMessage('');

      // Check if wallet address is already registered
      const existingRegistration = getUserRegistrationByWallet(formData.walletAddress);
      if (existingRegistration) {
        setErrorMessage('This wallet address is already registered. You cannot register multiple times with the same wallet.');
        return;
      }

      // Save user registration data
      const savedRegistration = saveUserRegistration({
        fullName: formData.fullName,
        email: formData.email,
        income: formData.income,
        walletAddress: formData.walletAddress
      });

      console.log('User registration saved:', savedRegistration);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccessMessage('Your request has been successfully submitted! We will review your application and get back to you soon.');
      setIsAlreadyRegistered(true);

      // Clear form errors
      setErrors({});
      
    } catch (error) {
      console.error('Registration error:', error);
      setSuccessMessage('');
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        User Registration
      </h1>
      
      {!selectedUser && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
          <p className="text-yellow-700 text-sm">
            Please connect your wallet before registration.
          </p>
        </div>
      )}

      {successMessage && (
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertDescription className="text-red-700">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {isAlreadyRegistered && !successMessage && !errorMessage && (
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertDescription className="text-blue-700">
            You have already submitted a registration request with this wallet.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange('fullName')}
            placeholder="John Doe"
            className={errors.fullName ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder="example@email.com"
            className={errors.email ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Income Information */}
        <div>
          <Label htmlFor="income">Income Information *</Label>
          <Input
            id="income"
            type="text"
            value={formData.income}
            onChange={handleInputChange('income')}
            placeholder="Annual income: $50,000"
            className={errors.income ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.income && (
            <p className="text-red-500 text-sm mt-1">{errors.income}</p>
          )}
        </div>

        {/* Wallet Address */}
        <div>
          <Label htmlFor="walletAddress">Wallet Address *</Label>
          <Input
            id="walletAddress"
            type="text"
            value={formData.walletAddress}
            onChange={handleInputChange('walletAddress')}
            placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            className={`${errors.walletAddress ? 'border-red-500' : ''} bg-gray-100`}
            disabled={true} // Auto-filled, not editable
          />
          {errors.walletAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.walletAddress}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            * Auto-filled when wallet is connected
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !selectedUser || isAlreadyRegistered}
        >
          {isSubmitting ? 'Requesting...' : 'Request'}
        </Button>
      </form>

    </div>
  );
}
