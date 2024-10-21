import React from "react";
import "./Toast.css";

type ToastProps = {
  message: string;
  status: "success" | "error";
};

const Toast: React.FC<ToastProps> = ({ message, status }) => {
  return (
    <div className={`toast ${status}`}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
