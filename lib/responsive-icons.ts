import { cva, type VariantProps } from "class-variance-authority";

export const iconVariants = cva(
  "inline-block shrink-0",
  {
    variants: {
      size: {
        xs: "h-3 w-3 sm:h-3.5 sm:w-3.5",
        sm: "h-4 w-4 sm:h-4 sm:w-4",
        default: "h-4 w-4 sm:h-5 sm:w-5",
        md: "h-5 w-5 sm:h-6 sm:w-6",
        lg: "h-6 w-6 sm:h-8 sm:w-8",
        xl: "h-8 w-8 sm:h-10 sm:w-10",
      },
      responsive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "xs",
        responsive: false,
        class: "h-3 w-3",
      },
      {
        size: "sm",
        responsive: false,
        class: "h-4 w-4",
      },
      {
        size: "default",
        responsive: false,
        class: "h-5 w-5",
      },
      {
        size: "md",
        responsive: false,
        class: "h-6 w-6",
      },
      {
        size: "lg",
        responsive: false,
        class: "h-8 w-8",
      },
      {
        size: "xl",
        responsive: false,
        class: "h-10 w-10",
      },
    ],
    defaultVariants: {
      size: "default",
      responsive: true,
    },
  }
);

export type IconVariantProps = VariantProps<typeof iconVariants>;

// Helper function to get icon class names
export function getIconClassName(
  size?: IconVariantProps["size"],
  responsive?: boolean
) {
  return iconVariants({ size, responsive });
} 