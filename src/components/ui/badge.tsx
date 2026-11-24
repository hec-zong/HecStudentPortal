import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-[#13c2b6] text-black font-semibold [a]:hover:bg-[#27b2d7]',
        secondary:
          'bg-[#87cbde]/25 text-black border-[#87cbde]/40 [a]:hover:bg-[#87cbde]/40',
        destructive:
          'bg-rose-50 text-rose-700 border-rose-200 focus-visible:ring-rose-200 [a]:hover:bg-rose-100',
        outline: 'border-[#e5e5e5] text-black bg-white [a]:hover:bg-[#f6fbfe]',
        ghost: 'hover:bg-[#f6fbfe] hover:text-black',
        link: 'text-[#13c2b6] underline-offset-4 hover:underline hover:text-[#27b2d7]',
        // CEGA Institutional Status Variants
        approved:
          'bg-[#e4faf8] text-[#0b746d] border-[#13c2b6]/40 font-semibold',
        inProgress:
          'bg-[#e8f7fb] text-[#117690] border-[#27b2d7]/40 font-semibold',
        resubmit:
          'bg-[#fff7ed] text-[#c2410c] border-[#f97316]/40 font-semibold',
        archived: 'bg-[#f5f5f5] text-[#666666] border-[#e5e5e5] font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge, badgeVariants };
