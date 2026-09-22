import { useNavigate } from "react-router-dom";

const OrderPlace = ({ setOrderPlaced }) => {
  const navigate = useNavigate();

  return (
    <section className="flex justify-center items-center bg-black/80 backdrop-blur-sm fixed inset-0 z-50 px-4">
      <div className="bg-white p-8 md:p-10 w-full max-w-[450px] text-center rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300 border border-zinc-200">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Order Confirmed!</h2>
        <p className="text-zinc-500 mt-2 mb-8 text-sm font-medium">
          Your order has been placed successfully. You can track your package in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            className="flex-1 py-3.5 text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-xl font-bold shadow-md shadow-blue-200 text-sm" 
            onClick={() => {
              setOrderPlaced(false);
              navigate("/orders");
            }}
          >
            Track Order 📦
          </button>

          <button 
            className="flex-1 py-3.5 text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all rounded-xl font-semibold text-sm" 
            onClick={() => setOrderPlaced(false)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderPlace;