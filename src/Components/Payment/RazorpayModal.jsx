import { useState } from "react";

const RazorpayModal = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  orderId,
  userEmail,
  userName,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("upi"); // upi, card, netbanking
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  // Card form state
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardName, setCardName] = useState(userName || "Customer Name");

  // UPI state
  const [upiId, setUpiId] = useState(
    userEmail ? `${userEmail.split("@")[0]}@upi` : "customer@upi"
  );

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState("HDFC");

  if (!isOpen) return null;

  const handlePay = () => {
    setProcessing(true);
    setStatusText("Connecting to payment network...");

    setTimeout(() => {
      setStatusText("Authorizing transaction...");
      setTimeout(() => {
        const paymentId = `pay_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`;
        onSuccess({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId || `order_${Date.now()}`,
          razorpay_signature: "simulated_valid_signature",
        });
        setProcessing(false);
      }, 1000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[820px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200">
        {/* Left Branding Panel (Razorpay Brand Design) */}
        <div className="w-full md:w-[310px] bg-[#0c2340] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-bold text-lg text-blue-400">
                🛒
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight tracking-tight">MyCoolStore</h3>
                <span className="text-[11px] text-blue-300 font-medium tracking-wider uppercase">
                  Razorpay Verified
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#14325a] border border-blue-900/50 rounded-xl p-4 mb-5">
              <p className="text-xs uppercase tracking-wider text-blue-200/70 font-semibold mb-1">
                Price Summary
              </p>
              <p className="text-3xl font-black tracking-tight text-white">₹{amount}</p>
            </div>

            {/* Customer Info */}
            <div className="bg-[#14325a]/60 border border-blue-900/40 rounded-xl p-3 text-xs text-blue-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-300">
                👤
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase font-bold text-blue-300">Using as</p>
                <p className="truncate font-semibold">{userEmail || "customer@example.com"}</p>
              </div>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="mt-8 pt-4 border-t border-blue-900/50 flex items-center justify-between text-xs text-blue-200/80">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400">🔒</span>
              <span className="font-medium">256-bit SSL</span>
            </div>
            <span className="text-[11px] text-blue-300 font-bold">
              Secured by <span className="text-white font-black">Razorpay</span>
            </span>
          </div>
        </div>

        {/* Right Options Panel */}
        <div className="flex-1 bg-white p-6 md:p-8 flex flex-col justify-between relative">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Payment Options</h2>
                <p className="text-xs text-gray-500">Choose your preferred payment method</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-30"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Method Tabs */}
            <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedMethod("upi")}
                className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition ${
                  selectedMethod === "upi"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ⚡ UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition ${
                  selectedMethod === "card"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                💳 Card
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod("netbanking")}
                className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition ${
                  selectedMethod === "netbanking"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🏦 Netbanking
              </button>
            </div>

            {/* Tab Views */}
            <div>
              {/* UPI Tab */}
              {selectedMethod === "upi" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-zinc-900" fill="currentColor">
                          <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h2v2h-2v-2zm-4-2h2v4h-2v-4zm6 4h2v4h-2v-4zm-4 2h2v2h-2v-2zm-2-4h2v2h-2v-2zm6-2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">Scan QR with any UPI App</p>
                        <p className="text-xs text-gray-500">Google Pay • PhonePe • Paytm • BHIM</p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Instant
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                      Or Pay via UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      A payment request will be sent to your UPI app.
                    </p>
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {selectedMethod === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 1111 1111 1111"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Netbanking Tab */}
              {selectedMethod === "netbanking" && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-600 block">
                    Select Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: "HDFC", name: "HDFC Bank", icon: "🏛️" },
                      { id: "SBI", name: "State Bank of India", icon: "🏦" },
                      { id: "ICICI", name: "ICICI Bank", icon: "🏢" },
                      { id: "AXIS", name: "Axis Bank", icon: "🏧" },
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                          selectedBank === bank.id
                            ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100 font-bold text-blue-900"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="text-lg">{bank.icon}</span>
                        <span className="text-xs font-semibold">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            {statusText && (
              <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-2 text-center mb-3 font-medium animate-pulse">
                {statusText}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="py-3 px-5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePay}
                disabled={processing}
                className="flex-1 py-3 px-6 bg-[#0066ff] hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Pay ₹{amount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayModal;
