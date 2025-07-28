import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (name: string, email: string, password: string) => {
    setError('');
    setIsLoading(true);
    try {
      await apiService.register({ name, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to register. Please try again.');
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} success={success} />
      </div>
    </div>
  );
};

export default RegisterPage;
