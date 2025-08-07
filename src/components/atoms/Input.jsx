import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  type = "text",
  className,
  placeholder,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-4 py-3 border border-gray-200 rounded-lg",
        "focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "placeholder:text-gray-400 transition-colors",
        className
      )}
      placeholder={placeholder}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;