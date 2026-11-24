import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[12px] border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-[#13c2b6] text-black font-bold shadow-sm shadow-[#13c2b6]/20 hover:bg-[#27b2d7] hover:text-black',
        outline:
          'border-[#e5e5e5] bg-white text-black hover:bg-[#f6fbfe] hover:border-[#27b2d7] hover:text-black shadow-xs',
        secondary:
          'bg-[#87cbde]/25 text-black border border-[#87cbde]/50 hover:bg-[#27b2d7] hover:text-black',
        ghost: 'text-[#666666] hover:bg-[#f6fbfe] hover:text-black',
        destructive:
          'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 focus-visible:border-rose-400 focus-visible:ring-rose-200',
        link: 'text-[#13c2b6] underline-offset-4 hover:underline hover:text-[#27b2d7]',
      },
      size: {
        default:
          'h-10 min-h-[44px] gap-2 px-4 text-sm sm:h-9 sm:min-h-0 sm:px-3.5',
        xs: "h-7 min-h-[44px] sm:min-h-0 gap-1 rounded-[10px] px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 min-h-[44px] sm:min-h-0 gap-1.5 rounded-[10px] px-2.5 text-xs sm:text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-11 min-h-[44px] gap-2.5 px-5 text-sm sm:text-base font-bold',
        icon: 'size-10 min-h-[44px] min-w-[44px] sm:size-9 sm:min-h-0 sm:min-w-0 rounded-[10px]',
        'icon-xs':
          "size-7 min-h-[44px] min-w-[44px] sm:size-6 sm:min-h-0 sm:min-w-0 rounded-[10px] [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-8 min-h-[44px] min-w-[44px] sm:size-7 sm:min-h-0 sm:min-w-0 rounded-[10px]',
        'icon-lg': 'size-11 min-h-[44px] min-w-[44px] rounded-[12px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
