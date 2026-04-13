import React from 'react';

const OrderSummary = ({ cart, subTotal, shippingFee, orderTotal, setOrderPlaced, setOrderSummary, setCart }) => {

  const handlePlaceOrder = () => {
    setOrderSummary(false);
    setOrderPlaced(true);
    setCart([]);
    localStorage.removeItem('cart'); // Clear storage once order is finalized
  };

  return (
    <section className='flex justify-center items-center bg-black/80 backdrop-blur-sm fixed inset-0 z-50 px-4'>
      <div className='bg-white p-8 w-full max-w-[550px] rounded-2xl shadow-2xl border border-zinc-200'>
        <h2 className='text-3xl text-zinc-900 font-black mb-6 text-center tracking-tight'>Confirm Your Order</h2>

        <div className='max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar'>
          {cart.map((item) => (
            <div key={item.id} className='flex justify-between items-center py-3 border-b border-zinc-100 last:border-0'>
              <div className='flex flex-col'>
                <span className='text-zinc-900 font-semibold'>{item.name}</span>
                <span className='text-zinc-500 text-sm'>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</span>
              </div>
              <span className='text-zinc-900 font-medium'>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className='mt-6 space-y-3 pt-4 border-t border-zinc-200'>
          <div className='flex justify-between text-zinc-600'>
            <span>Sub Total</span>
            <span className='font-medium'>₹{subTotal.toFixed(2)}</span>
          </div>

          <div className='flex justify-between text-zinc-600'>
            <span>Shipping & Handling</span>
            <span className='font-medium'>₹{shippingFee.toFixed(2)}</span>
          </div>

          <div className='flex justify-between pt-4 border-t border-zinc-200'>
            <span className='text-zinc-900 font-bold text-xl'>Grand Total</span>
            <span className='text-blue-600 font-black text-2xl'>₹{orderTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className='flex mt-8 gap-4'>
          <button 
            className='flex-1 py-4 text-zinc-600 font-bold hover:bg-zinc-100 rounded-xl transition-colors' 
            onClick={() => setOrderSummary(false)}
          >
            Go Back
          </button>
          <button 
            className='flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all' 
            onClick={handlePlaceOrder}
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;