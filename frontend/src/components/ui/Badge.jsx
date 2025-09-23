import React from "react";

function Badge({ variant = "default", className = "", ...props }) {
  // Define variant classes manually
  let baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  let variantClasses = "";
  switch (variant) {
    case "secondary":
      variantClasses =
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";
      break;
    case "destructive":
      variantClasses =
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80";
      break;
    case "outline":
      variantClasses = "text-foreground";
      break;
    default:
      variantClasses =
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80";
  }

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} {...props} />
  );
}

export { Badge };
