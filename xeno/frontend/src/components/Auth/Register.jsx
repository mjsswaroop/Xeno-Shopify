import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Store, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hookes/useAuth';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
   const { register: registerUser, loading } = useAuth();
  //const { register, loading } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');


const onSubmit = async (data) => {
  try {
    console.log('Form data being sent:', data); // Debug log
    
    // Clean the data before sending
    const cleanData = {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      storeName: data.storeName?.trim(),
      password: data.password
  
    };
    
    console.log('Cleaned data:', cleanData); // Debug log
    
    await registerUser(cleanData);
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-600">
            <span className="text-white font-bold text-xl">SP</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
<label htmlFor="name" className="block text-sm font-medium text-gray-700">
Full Name
</label>
<div className="mt-1 relative rounded-md shadow-sm">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<User className="h-5 w-5 text-gray-400" />
</div>
<input
id="name"
type="text"
autoComplete="name"
{...register('name', {
required: 'Name is required',
minLength: {
value: 2,
message: 'Name must be at least 2 characters'
}
})}
className={`block w-full pl-10 pr-3 py-2 border ${
errors.name ? 'border-red-500' : 'border-gray-300'
} rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
placeholder="John Doe"
/>
</div>
{errors.name && (
<p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
)}
</div>

{/* Email Field */}
<div>
<label htmlFor="email" className="block text-sm font-medium text-gray-700">
Email Address
</label>
<div className="mt-1 relative rounded-md shadow-sm">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<Mail className="h-5 w-5 text-gray-400" />
</div>
<input
id="email"
type="email"
autoComplete="email"
{...register('email', {
required: 'Email is required',
pattern: {
value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
message: 'Please enter a valid email address'
}
})}
className={`block w-full pl-10 pr-3 py-2 border ${
errors.email ? 'border-red-500' : 'border-gray-300'
} rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
placeholder="you@example.com"
/>
</div>
{errors.email && (
<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
)}
</div>

{/* Store Name Field */}
<div>
<label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
Store Name
</label>
<div className="mt-1 relative rounded-md shadow-sm">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<Store className="h-5 w-5 text-gray-400" />
</div>
<input
id="storeName"
type="text"
autoComplete="organization"
{...register('storeName', {
required: 'Store name is required',
minLength: {
value: 3,
message: 'Store name must be at least 3 characters'
}
})}
className={`block w-full pl-10 pr-3 py-2 border ${
errors.storeName ? 'border-red-500' : 'border-gray-300'
} rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
placeholder="My Awesome Store"
/>
</div>
{errors.storeName && (
<p className="mt-1 text-sm text-red-600">{errors.storeName.message}</p>
)}
</div>

{/* Password Field */}
<div>
<label htmlFor="password" className="block text-sm font-medium text-gray-700">
Password
</label>
<div className="mt-1 relative rounded-md shadow-sm">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<Lock className="h-5 w-5 text-gray-400" />
</div>
<input
id="password"
type={showPassword ? 'text' : 'password'}
autoComplete="new-password"
{...register('password', {
required: 'Password is required',
minLength: {
value: 8,
message: 'Password must be at least 8 characters'
},
pattern: {
value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
message: 'Password must contain uppercase, lowercase, number, and special character'
}
})}
className={`block w-full pl-10 pr-10 py-2 border ${
errors.password ? 'border-red-500' : 'border-gray-300'
} rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
placeholder="••••••••"
/>
<button
type="button"
className="absolute inset-y-0 right-0 pr-3 flex items-center"
onClick={() => setShowPassword(!showPassword)}
>
{showPassword ? (
<EyeOff className="h-5 w-5 text-gray-400" />
) : (
<Eye className="h-5 w-5 text-gray-400" />
)}
</button>
</div>
{errors.password && (
<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
)}
</div>

{/* Confirm Password Field */}
<div>
<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
Confirm Password
</label>
<div className="mt-1 relative rounded-md shadow-sm">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<Lock className="h-5 w-5 text-gray-400" />
</div>
<input
id="confirmPassword"
type={showPassword ? 'text' : 'password'}
autoComplete="new-password"
{...register('confirmPassword', {
required: 'Please confirm your password',
validate: value =>
value === password || 'Passwords do not match'
})}
className={`block w-full pl-10 pr-10 py-2 border ${
errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
} rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
placeholder="••••••••"
/>
<button
type="button"
className="absolute inset-y-0 right-0 pr-3 flex items-center"
onClick={() => setShowPassword(!showPassword)}
>
{showPassword ? (
<EyeOff className="h-5 w-5 text-gray-400" />
) : (
<Eye className="h-5 w-5 text-gray-400" />
)}
</button>
</div>
{errors.confirmPassword && (
<p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
)}
</div>
</div>

<div>
<button
type="submit"
disabled={loading}
className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
>
{loading ? (
<svg
className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
>
<circle
className="opacity-25"
cx="12"
cy="12"
r="10"
stroke="currentColor"
strokeWidth="4"
></circle>
<path
className="opacity-75"
fill="currentColor"
d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
></path>
</svg>
) : null}
{loading ? 'Creating Account...' : 'Create Account'}
</button>
</div>
</form>

<div className="text-center">
<p className="text-sm text-gray-600">
By creating an account, you agree to our{' '}
<a href="#" className="font-medium text-primary-600 hover:text-primary-500">
Terms of Service
</a>{' '}
and{' '}
<a href="#" className="font-medium text-primary-600 hover:text-primary-500">
Privacy Policy
</a>
.
</p>
</div>
</div>
</div>
);
};

export default Register;