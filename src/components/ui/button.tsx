import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "navy-secondary": "bg-black-pearl-900 text-black-pearl-60 dark:bg-black-pearl-50 dark:text-black-pearl-900 hover:bg-black-pearl-800 hover:text-black-pearl-60 dark:hover:bg-black-pearl-60 dark:hover:text-black-pearl-900 font-bold rounded-full ",
        "light-navy-secondary": "bg-black-pearl-60 text-black-pearl-900 hover:bg-black-pearl-100/50 hover:text-black-pearl-900 text-navy dark:bg-black-pearl-900 dark:text-black-pearl-60  hover:text-black-pearl-900 dark:hover:bg-black-pearl-800 dark:hover:text-black-pearl-60 font-bold rounded-full",
        "submit": "w-full text-main-blue dark:text-blue-300 border border-main-blue dark:border-blue-900 py-2 flex items-center justify-center gap-2 hover:bg-periwinkle/30 dark:hover:bg-blue-900/10 rounded-full"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        md: "px-8 py-3",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
