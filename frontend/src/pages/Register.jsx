import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function Register() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setServerError('');
        const result = await registerUser(data);
        if (result.ok) {
            // Redirect to login
            navigate('/Login');
        } else {
            // Handle array of errors or object of errors from DRF
            let message = 'Registration failed';
            if (typeof result.error === 'string') {
                message = result.error;
            } else if (typeof result.error === 'object') {
                // Flatten DRF errors
                message = Object.entries(result.error).map(([key, val]) => `${key}: ${val}`).join(', ');
            }
            setServerError(message);
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
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-stone-600">
                        Join Second'O Zerlig today
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="sr-only">First Name</label>
                                <input
                                    id="first_name"
                                    type="text"
                                    placeholder="First Name"
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.first_name ? 'border-red-500' : 'border-stone-300'} placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                    {...register("first_name", { required: "First name is required" })}
                                />
                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="last_name" className="sr-only">Last Name</label>
                                <input
                                    id="last_name"
                                    type="text"
                                    placeholder="Last Name"
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.last_name ? 'border-red-500' : 'border-stone-300'} placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm`}
                                    {...register("last_name", { required: "Last name is required" })}
                                />
                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                            </div>
                        </div>

                        <div>
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
                                {...register("password", { required: "Password, min 6 chars", minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
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
                            {isSubmitting ? 'Registering...' : 'Create Account'}
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-stone-600">Already have an account? </span>
                        <Link to={createPageUrl('Login')} className="font-medium text-amber-600 hover:text-amber-500">
                            Sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
