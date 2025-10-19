import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export function useRegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const { createUser, user, authErrors, loading: authLoading, message } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard/buy-ticket');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        throw new Error('You must be at least 18 years old to register.');
      }
      await createUser(data);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (message && (!authErrors || authErrors.length === 0)) {
      setRegistered(true);
      setIsSubmitting(false);
    }
  }, [message, authErrors]);

  const loading = authLoading || isSubmitting;

  return {
    register,
    handleSubmit,
    watch,
    errors,
    createUser,
    user,
    authErrors,
    loading,
    message,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    registered,
    onSubmit
  };
}
