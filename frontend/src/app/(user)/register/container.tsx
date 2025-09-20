"use client";

import { useEffect, useState, useId, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  getUserRegistrationByWallet,
  saveUserRegistration,
} from "@/data/registrations";
import { useWalletStore } from "@/stores/walletStore";

// Types
interface UserRegistrationForm {
  fullName: string;
  email: string;
  income: string;
  walletAddress: string;
}

type FormField = keyof UserRegistrationForm;

// Constants
const FORM_FIELDS: {
  key: FormField;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  {
    key: "fullName",
    label: "Full Name",
    placeholder: "John Doe",
    type: "text",
  },
  {
    key: "email",
    label: "Email Address",
    placeholder: "example@email.com",
    type: "email",
  },
  {
    key: "income",
    label: "Income Information",
    placeholder: "Annual income: $50,000",
    type: "text",
  },
];

const MESSAGES = {
  WALLET_REQUIRED: "Please connect your wallet before registration.",
  REGISTRATION_SUCCESS:
    "Your request has been successfully submitted! We will review your application and get back to you soon.",
  REGISTRATION_ERROR: "Registration failed. Please try again.",
  ALREADY_REGISTERED:
    "You have already submitted a registration request with this wallet.",
  DUPLICATE_WALLET:
    "This wallet address is already registered. You cannot register multiple times with the same wallet.",
  WALLET_AUTO_FILL: "* Auto-filled when wallet is connected",
} as const;

// Custom hooks
const useFormValidation = (formData: UserRegistrationForm) => {
  const [errors, setErrors] = useState<Partial<UserRegistrationForm>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<UserRegistrationForm> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.income.trim()) {
      newErrors.income = "Income information is required";
    }

    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = "Wallet address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const clearFieldError = useCallback(
    (field: FormField) => {
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors],
  );

  return { errors, validateForm, clearFieldError };
};

// Components
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Spinner variant="circle" className="h-8 w-8 text-blue-600" />
    <p className="mt-4 text-sm text-gray-600 font-medium">
      Loading registration form...
    </p>
  </div>
);

const StatusAlert = ({
  type,
  message,
  className = "",
}: {
  type: "warning" | "success" | "error" | "info";
  message: string;
  className?: string;
}) => {
  const alertVariants = {
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <Alert className={`mb-6 ${alertVariants[type]} ${className}`}>
      <AlertDescription className="text-sm font-medium">
        {message}
      </AlertDescription>
    </Alert>
  );
};

const FormField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  isWalletField = false,
}: {
  field: FormField;
  value: string;
  onChange: (
    field: FormField,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  isWalletField?: boolean;
}) => {
  const fieldConfig = FORM_FIELDS.find((f) => f.key === field);
  const fieldId = useId();

  if (!fieldConfig) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-sm font-semibold text-gray-700">
        {fieldConfig.label} *
      </Label>
      <Input
        id={fieldId}
        type={fieldConfig.type}
        value={value}
        onChange={onChange(field)}
        placeholder={fieldConfig.placeholder}
        className={`h-12 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500"
        } ${isWalletField ? "bg-gray-50" : ""}`}
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      {isWalletField && (
        <p className="text-gray-500 text-xs font-medium">
          {MESSAGES.WALLET_AUTO_FILL}
        </p>
      )}
    </div>
  );
};

export default function RegisterContainer() {
  const { selectedUser } = useWalletStore();
  const [formData, setFormData] = useState<UserRegistrationForm>({
    fullName: "",
    email: "",
    income: "",
    walletAddress: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const { errors, validateForm, clearFieldError } = useFormValidation(formData);

  // Effects
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    if (selectedUser?.address) {
      setFormData((prev) => ({
        ...prev,
        walletAddress: selectedUser.address,
      }));

      const existingRegistration = getUserRegistrationByWallet(
        selectedUser.address,
      );
      if (existingRegistration) {
        setIsAlreadyRegistered(true);
        setFormData({
          fullName: existingRegistration.fullName,
          email: existingRegistration.email,
          income: existingRegistration.income,
          walletAddress: existingRegistration.walletAddress,
        });
      } else {
        setIsAlreadyRegistered(false);
      }
    }

    return () => clearTimeout(timer);
  }, [selectedUser]);

  // Handlers
  const handleInputChange = useCallback(
    (field: FormField) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      clearFieldError(field);
    },
    [clearFieldError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);
      setSuccessMessage("");
      setErrorMessage("");

      try {
        const existingRegistration = getUserRegistrationByWallet(
          formData.walletAddress,
        );
        if (existingRegistration) {
          setErrorMessage(MESSAGES.DUPLICATE_WALLET);
          return;
        }

        const savedRegistration = saveUserRegistration(formData);
        console.log("User registration saved:", savedRegistration);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSuccessMessage(MESSAGES.REGISTRATION_SUCCESS);
        setIsAlreadyRegistered(true);
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage(MESSAGES.REGISTRATION_ERROR);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm],
  );

  // Show loading spinner initially
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">
              User Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-800">
            User Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Status Messages */}
          {!selectedUser && (
            <StatusAlert type="warning" message={MESSAGES.WALLET_REQUIRED} />
          )}

          {successMessage && (
            <StatusAlert type="success" message={successMessage} />
          )}

          {errorMessage && <StatusAlert type="error" message={errorMessage} />}

          {isAlreadyRegistered && !successMessage && !errorMessage && (
            <StatusAlert type="info" message={MESSAGES.ALREADY_REGISTERED} />
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {FORM_FIELDS.map((fieldConfig) => (
              <FormField
                key={fieldConfig.key}
                field={fieldConfig.key}
                value={formData[fieldConfig.key]}
                onChange={handleInputChange}
                error={errors[fieldConfig.key]}
                disabled={isSubmitting}
              />
            ))}

            {/* Wallet Address Field */}
            <FormField
              field="walletAddress"
              value={formData.walletAddress}
              onChange={handleInputChange}
              error={errors.walletAddress}
              disabled={true}
              isWalletField={true}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold rounded-xl"
              disabled={isSubmitting || !selectedUser || isAlreadyRegistered}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Spinner variant="ellipsis" className="h-4 w-4 mr-2" />
                  Requesting...
                </div>
              ) : (
                "Request Registration"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
