import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({
  variant = "primary",
  size = "default",
  children,
  className,
  icon,
  iconPosition = "left",
  loading = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105",
    secondary: "bg-white text-primary border border-primary hover:bg-primary/5",
    accent: "bg-gradient-to-r from-accent to-orange-400 text-white hover:shadow-lg hover:scale-105",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/5"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm gap-1",
    default: "px-4 py-2.5 gap-2",
    lg: "px-6 py-3 text-lg gap-2"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
      {!loading && icon && iconPosition === "left" && <ApperIcon name={icon} size={16} />}
      {children}
      {!loading && icon && iconPosition === "right" && <ApperIcon name={icon} size={16} />}
    </button>
  );
});

Button.displayName = "Button";

export default Button;