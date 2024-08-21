import { useState, useEffect } from "react";

const OtpCounter = ({ initialMinute = 0, initialSeconds = 0, mobile }) => {
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const sendOtpAgain = (initialSeconds) => {
    // let body = { mobile }
    setSeconds(initialSeconds);
  };

  return (
    <div className="flex items-center justify-center m-[10px]">
      {minutes === 0 && seconds === 0 ? (
        <p
          className="otp-desc text-[12px] block text-center text-[#494f55] cursor-pointer"
          onClick={sendOtpAgain}
        ></p>
      ) : (
        <p className="otp-desc text-[12px] block text-center text-[#bfc2c5]">
          {" "}
          ارسال مجدد کد تا{" "}
          <span className="otp-timer w-[20px] inline-block">
            {minutes > 0 ? `${minutes} :` : null}
            {seconds < 10 ? `${seconds}` : seconds}
          </span>{" "}
          ثانیه دیگر
        </p>
      )}
    </div>
  );
};

export default OtpCounter;
