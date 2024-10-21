import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast from "../components/Toast";

type ToastContextType = {
  addToast: (message: string, status: "success" | "error") => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<
    { message: string; status: "success" | "error"; id: number }[]
  >([]);

  const addToast = (message: string, status: "success" | "error") => {
    const id = Math.random();
    setToasts((prevToasts) => [{ message, status, id }, ...prevToasts]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} status={toast.status} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
