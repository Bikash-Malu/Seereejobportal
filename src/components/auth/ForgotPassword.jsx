import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]); // State to hold 4 OTP digits
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState(""); // State for new password
    const [timer, setTimer] = useState(120); // 2 minutes in seconds
    const [timerActive, setTimerActive] = useState(false);
    const navigate=useNavigate();
    useEffect(() => {
        let interval;
        if (timerActive && otpSent) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, otpSent]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleOtpChange = (e, index) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);

        // Automatically focus on the next input field
        if (e.target.value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }, {
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (res.data.success) {
                toast.success('OTP has been sent to your email.');
                setOtpSent(true); // OTP has been sent
                setTimer(120); // Reset timer
                setTimerActive(true); // Start the timer
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const completeOtp = otp.join(""); // Concatenate OTP digits

        if (completeOtp.length !== 4) {
            toast.error('Please enter the 4-digit OTP');
            return;
        }

        try {
            setLoading(true);
            // Verify OTP first
            const verifyRes = await axios.post(`${USER_API_END_POINT}/verify-otp`, { email, otp: completeOtp }, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (verifyRes.data.success) {
                // OTP verified successfully
                setOtpVerified(true); // Show new password field
                toast.success('OTP verified successfully. You can now set a new password.');
            } else {
                toast.error(verifyRes.data.message || 'Invalid OTP or something went wrong');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword) {
            toast.error('Please enter your new password');
            return;
        }

        try {
            setLoading(true);
          
            const resetRes = await axios.post(`${USER_API_END_POINT}/reset-password`, { email, newPassword }, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (resetRes.data.success) {
                toast.success(resetRes.data.message);
                navigate('/login')
           
            } else {
                toast.error(resetRes.data.message || 'Error resetting password');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    // Convert timer seconds to MM:SS format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center px-4 sm:px-6 lg:px-8'>
                <form
                    onSubmit={otpVerified ? handlePasswordResetSubmit : otpSent ? handleOtpSubmit : handleEmailSubmit}
                    className='w-full max-w-md bg-white border border-gray-200 rounded-md p-6 sm:p-8 my-10'
                >
                    <h1 className='font-bold text-xl mb-5'>
                        {otpVerified ? 'Reset Password' : otpSent ? 'Verify OTP' : 'Forgot Password'}
                    </h1>
                    {!otpSent ? (
                        <>
                            {/* Email Input */}
                            <div className='my-2'>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your registered email"
                                />
                            </div>
                        </>
                    ) : otpVerified ? (
                        <>
                            {/* New Password Input */}
                            <div className='my-2'>
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    placeholder="Enter your new password"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* OTP Inputs */}
                            <div className='flex flex-col items-center my-2'>
                                <div className='flex justify-between mb-2'>
                                    {otp.map((value, index) => (
                                        <Input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={value}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            className="w-1/4 text-center text-xl mx-1"
                                        />
                                    ))}
                                </div>
                                {timerActive && (
                                    <div className='text-red-500 text-sm'>
                                        Time left: {formatTime(timer)}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {loading ? (
                        <Button className="w-full my-4">
                            <span className="loader mr-2"></span> {otpSent ? 'Processing...' : 'Sending OTP...'}
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            {otpVerified ? 'Reset Password' : otpSent ? 'Verify OTP' : 'Send OTP'}
                        </Button>
                    )}
                    {!otpSent && (
                        <span className='text-sm'>
                            Remember your password? <Link to="/login" className='text-blue-600'>Login</Link>
                        </span>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
