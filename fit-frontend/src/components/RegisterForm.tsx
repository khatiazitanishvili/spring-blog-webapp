"use client";

import React from "react";
import { Form, Input, Button } from "@nextui-org/react";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  success,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ name?: string; password?: string }>({});

  const getPasswordError = (value: string) => {
    if (value.length < 4) {
      return "Password must be at least 4 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least 1 uppercase letter";
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      return "Password must contain at least 1 symbol";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (name.toLowerCase() === "admin") {
      newErrors.name = "Please choose a different username";
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit(name, email, password);
  };

  return (
    <Form
      className="w-full max-w-md mx-auto bg-white p-8 rounded-xl space-y-6"
      validationErrors={errors}
      onSubmit={handleSubmit}
    >
      <Input
        isRequired
        name="name"
        label="Name"
        labelPlacement="outside"
        placeholder="Your name"
        value={name}
        onValueChange={setName}
        errorMessage={errors.name}
        isInvalid={!!errors.name}
        isDisabled={isLoading}
      />

      <Input
        isRequired
        type="email"
        name="email"
        label="Email"
        labelPlacement="outside"
        placeholder="Email address"
        value={email}
        onValueChange={setEmail}
        isDisabled={isLoading}
      />

      <Input
        isRequired
        type="password"
        name="password"
        label="Password"
        labelPlacement="outside"
        placeholder="Enter your password"
        value={password}
        onValueChange={setPassword}
        errorMessage={errors.password}
        isInvalid={!!errors.password}
        isDisabled={isLoading}
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Registration successful! Redirecting to login...
          </p>
        </div>
      )}

      <Button
        type="submit"
        color="primary"
        isDisabled={isLoading}
        className="w-full bg-orange-500 text-white font-semibold"
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
};

export default RegisterForm;
