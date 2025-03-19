'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useSendVerificationOtpMutation, useVerifyOtpMutation } from '../../apiSlice/emailAuthApiSlice';
import { Alert, AlertDescription } from '../ui/alert';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
  autoSendOtp?: boolean; // Add this prop to control automatic OTP sending
}

export default function EmailVerification({ 
  email, 
  onVerified, 
  onCancel, 
  autoSendOtp = true // Default to true for backward compatibility
}: EmailVerificationProps) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timeout
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  
  // API hooks
  const [sendOtp, { isLoading: isSendingOtp }] = useSendVerificationOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  
  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);
  
  // Send OTP when component mounts, but only if autoSendOtp is true
  useEffect(() => {
    if (autoSendOtp) {
      console.log("EmailVerification mounted, sending OTP to:", email);
      sendOtpToEmail();
    }
  }, []); // Only run on mount
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Send OTP to email
  const sendOtpToEmail = async () => {
    try {
      setError(null);
      console.log("Sending OTP to email:", email);
      const response = await sendOtp({ email }).unwrap();
      console.log("OTP sent successfully:", response);
      setTimeLeft(60); // Reset timer to 60 seconds
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(err.data?.message || 'Failed to send verification code');
    }
  };
    
  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    try {
      setError(null);
      console.log("Verifying OTP:", otp, "for email:", email);
      const response = await verifyOtp({ email, otp }).unwrap();
      console.log("OTP verification response:", response);
      
      if (response.success) {
        console.log("OTP verified successfully");
        setIsVerified(true);
        // Small delay to show the success state before calling the callback
        setTimeout(() => {
          console.log("Calling onVerified callback");
          onVerified();
        }, 1000);
      } else {
        console.log("OTP verification failed");
        setError('Invalid verification code');
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(err.data?.message || 'Invalid verification code');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleVerifyOtp();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">Verify Your Email</h3>
        <p className="text-sm text-gray-500">
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Verification Code</label>
            <span className="text-xs text-gray-500">
              {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : 'Code expired'}
            </span>
          </div>
          <Input
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            onKeyPress={handleKeyPress}
            className="text-center text-lg py-5 letter-spacing-1"
            disabled={isVerified}
          />
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleVerifyOtp}
            disabled={!otp || otp.length !== 6 || isVerifyingOtp || isVerified || timeLeft <= 0}
            className="w-full"
          >
            {isVerifyingOtp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : isVerified ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Verified
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>
          
          <div className="flex justify-between text-sm mt-2">
            <button
              type="button"
              onClick={() => sendOtpToEmail()}
              disabled={timeLeft > 0 || isSendingOtp || isVerified}
              className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400"
            >
              {isSendingOtp ? 'Sending...' : 'Resend Code'}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}