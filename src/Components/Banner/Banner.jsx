import React, { useEffect, useState } from 'react';
import BannerImage from '../../assets/banner.jpg';

const Banner = () => {
  const initialTime = 5 * 60 * 60;

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem('remainingTime');
    return storedTime && parseInt(storedTime, 10) > 0 
      ? parseInt(storedTime, 10) 
      : initialTime;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          localStorage.setItem('remainingTime', 0);
          return 0;
        }
        localStorage.setItem('remainingTime', newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft <= 0]);

  const getFormattedTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  };

  const { hours, minutes, seconds } = getFormattedTime(timeLeft);

  return (
    <section 
      className='h-[60vh] mt-[14vh] bg-cover bg-top'
      style={{ backgroundImage: `url(${BannerImage})` }}
    >
      <div className='max-w-[1300px] mx-auto px-12 h-full flex flex-col justify-center gap-3'>
        <h1 className='text-red-600 text-9xl uppercase font-bold tracking-tight'>Big Sale!</h1>
        <h2 className='text-zinc-800 text-3xl'>Upto 50% Off - Limited Time Only!</h2>
        
        <div className='text-6xl font-bold text-zinc-800 flex gap-x-2 mt-4'>
          <span className='p-3'>{hours}</span>:
          <span className='p-3'>{minutes}</span>:
          <span className='p-3'>{seconds}</span>
        </div>
      </div>
    </section>
  );
};

export default Banner;