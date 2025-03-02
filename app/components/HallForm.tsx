import React, { useState } from "react";

interface HallFormProps {
  selectedHallId: number; // Changed from string to number
  selectedDate: string;
  setMessage: (message: string) => void;
}

const HallForm: React.FC<HallFormProps> = ({
  selectedHallId,
  selectedDate,
  setMessage,
}) => {
  const [name, setName] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  const sendOtp = async () => {
    if (!mobileNumber) {
      setMessage("Please enter your mobile number.");
      return;
    }

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: "+91" + mobileNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP sent successfully!");
        setIsOtpSent(true);
      } else {
        setMessage(`Error: ${data.message || "Failed to send OTP."}`);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error: Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: "+91" + mobileNumber, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP verified successfully!");
        setIsOtpVerified(true);
      } else {
        setMessage(`Error: ${data.message || "Failed to verify OTP."}`);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Error: Failed to verify OTP.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpVerified) {
      setMessage("Please verify your OTP before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/hallforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: "+91" + mobileNumber,
          formDetails: {
            name,
            reason,
            mobileNumber: "+91" + mobileNumber,
            mobileNumberConfirmation: "+91" + mobileNumber, // Add this field
            date: selectedDate,
            hallId: selectedHallId, // Ensure it sends the number as is
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Booking successful!");
        setName("");
        setReason("");
        setMobileNumber("");
        setOtp("");
        setIsOtpSent(false);
        setIsOtpVerified(false);
      } else {
        setMessage(`Error: ${data.message || "Failed to book hall."}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Error: Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Reason for Booking</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Mobile Number</label>
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          required
        />
        {!isOtpSent && (
          <button
            type="button"
            onClick={sendOtp}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send OTP
          </button>
        )}
      </div>
      {isOtpSent && (
        <div>
          <label className="block text-sm font-medium">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          />
          {!isOtpVerified && (
            <button
              type="button"
              onClick={verifyOtp}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Verify OTP
            </button>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Book Now"}
      </button>
    </form>
  );
};

export default HallForm;
