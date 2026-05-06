import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setServerError('');
        const result = await login(data);
        if (result.ok) {
            navigate('/');
        } else {
            // Handle specific error messages or fallback
            setServerError(typeof result.error === 'string' ? result.error : 'Invalid phone number or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-stone-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-stone-600">
                        Sign in to your account
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="phone_number" className="sr-only">Phone Number</label>
                            <input
                                id="phone_number"
                                type="text"
                                placeholder="Phone Number (e.g. 65000000)"
                                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.phone_number ? 'border-red-500' : 'border-stone-300'} placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                {...register("phone_number", { required: "Phone number is required" })}
                            />
                            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.password ? 'border-red-500' : 'border-stone-300'} placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{serverError}</span>
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-stone-600">Don't have an account? </span>
                        <Link to={createPageUrl('Register')} className="font-medium text-amber-600 hover:text-amber-500">
                            Register here
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
