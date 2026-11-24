import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from 'cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'h-10 min-h-[44px] w-full min-w-0 rounded-[10px] border border-[#e5e5e5] bg-white px-3 py-1.5 text-sm text-black transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#666666] focus-visible:border-[#13c2b6] focus-visible:ring-3 focus-visible:ring-[#13c2b6]/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 aria-invalid:border-rose-500 aria-invalid:ring-3 aria-invalid:ring-rose-200 sm:h-9 sm:min-h-0',
        className
      )}
      {...props}
    />
  );
}

export { Input };
