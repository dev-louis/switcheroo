import * as React from "react";

import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { showClearButton?: boolean }
>(({ className, type, showClearButton, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm transition-[color,box-shadow] outline-hidden file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring/70 focus-visible:ring-ring/20 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive -ms-px shadow-none focus-visible:z-10",
          className
        )}
        ref={ref}
        {...props}
      />
      {showClearButton && (
        <button
          type="button"
          className={`absolute right-3 top-1/2 -translate-y-1/2 transform transition duration-300 ${
            props.value ? "scale-100" : "scale-75 opacity-0"
          }`}
          onClick={() => {
            if (props.onChange) {
              const event = {
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>;
              props.onChange(event);
            }
          }}
        >
          <XIcon size="18" />
        </button>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
