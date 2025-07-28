"use client";

import React from "react";
import { Form, Input, Button, Checkbox } from "@nextui-org/react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ password?: string }>({});

  const getPasswordError = (value: string) => {
    if (value.length < 4) {
      return "Password must be at least 4 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must include at least 1 uppercase letter";
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      return "Password must include at least 1 symbol";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic password check
    const passwordError = getPasswordError(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    setErrors({});
    await onSubmit(email, password);
  };

  return (
    <Form
      className="w-full max-w-md mx-auto bg-white p-8 rounded-xl space-y-6"
      validationErrors={errors}
      onSubmit={handleSubmit}
    >
      <Input
        isRequired
        type="email"
        name="email"
        label="Email"
        labelPlacement="outside"
        placeholder="Enter your email"
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

      <Button
        type="submit"
        color="primary"
        isDisabled={isLoading}
        className="w-full bg-orange-500 text-white font-semibold "
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </Form>
  );
};

export default LoginForm;
