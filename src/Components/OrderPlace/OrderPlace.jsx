import React from 'react';

const OrderPlace = ({ setOrderPlaced }) => {
  return (
    <section className='flex justify-center items-center bg-black/80 backdrop-blur-sm fixed inset-0 z-50 px-4'>
      <div className='bg-white p-10 w-full max-w-[450px] text-center rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300'>
        {/* Success Icon Placeholder */}
        <div className='w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className='text-4xl text-zinc-900 font-black tracking-tight'>Success!</h2>
        <p className='text-zinc-500 mt-2 mb-8 font-medium'>
          Your order has been placed. <br /> Thanks for shopping with MyCoolStore!
        </p>

        <button 
          className='w-full py-4 text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-xl font-bold shadow-lg shadow-blue-200' 
          onClick={() => setOrderPlaced(false)}
        >
          Continue Shopping
        </button>
      </div>
    </section>
  );
};

export default OrderPlace;