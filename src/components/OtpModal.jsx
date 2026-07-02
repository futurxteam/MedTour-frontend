import React, { useState } from "react";
import "./OtpModal.css";

/**
 * OtpModal — shared OTP verification overlay.
 *
 * Props:
 *   phone         {string}   — masked phone number to display
 *   onVerify      {fn}       — async (otp: string) => void  — called when user clicks "Verify"
 *   onResend      {fn}       — async () => void             — called when user clicks "Resend"
 *   onClose       {fn}       — () => void                   — called when user cancels
 *   loading       {boolean}  — show spinner on Verify button
 *   error         {string}   — inline error message (pass "" to clear)
 */
export default function OtpModal({ phone, onVerify, onResend, onClose, loading, error }) {
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleVerify = () => {
    if (!otp.trim()) return;
    onVerify(otp.trim());
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    try {
      await onResend();
      setResendMsg("OTP resent successfully.");
      setOtp("");
    } catch {
      setResendMsg("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="otp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="otp-modal-title">
      <div className="otp-modal-card">
        {/* Header */}
        <div className="otp-modal-header">
          <div className="otp-modal-icon">🔐</div>
          <h2 id="otp-modal-title" className="otp-modal-title">Verify Your Phone</h2>
          <p className="otp-modal-subtitle">
            Enter the 6-digit code sent to <strong>{phone}</strong>
          </p>
          <p className="otp-modal-dev-hint">
            🛠 Development mode: use <strong>123</strong>
          </p>
        </div>

        {/* OTP Input */}
        <div className="otp-input-wrapper">
          <input
            id="otp-input"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="• • • • • •"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyDown={handleKeyDown}
            className={`otp-input ${error ? "otp-input--error" : ""}`}
            autoFocus
            aria-label="OTP code"
            disabled={loading}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="otp-error-msg" role="alert">⚠ {error}</p>
        )}

        {/* Resend message */}
        {resendMsg && (
          <p className={`otp-resend-msg ${resendMsg.includes("Failed") ? "otp-resend-msg--error" : ""}`}>
            {resendMsg}
          </p>
        )}

        {/* Actions */}
        <div className="otp-modal-actions">
          <button
            className="otp-btn otp-btn--primary"
            onClick={handleVerify}
            disabled={loading || !otp.trim()}
          >
            {loading ? (
              <span className="otp-spinner" aria-label="Verifying…" />
            ) : (
              "Verify & Submit"
            )}
          </button>

          <button
            className="otp-btn otp-btn--ghost"
            onClick={handleResend}
            disabled={resendLoading || loading}
          >
            {resendLoading ? "Sending…" : "Resend OTP"}
          </button>

          <button
            className="otp-btn otp-btn--cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
