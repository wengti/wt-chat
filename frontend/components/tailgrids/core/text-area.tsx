import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { useId, type ComponentProps } from "react";

const textAreaStyles = cva(
  "bg-input-background peer w-full rounded-lg border px-4 py-3.5 text-title-50 outline-none placeholder:text-input-placeholder-text focus:border-icon-green",
  {
    variants: {
      state: {
        default:
          "border-letter-black dark:border-letter-white",
        error:
          "border-input-error-focus-border",
        success:
          "border-input-success-focus-border"
      }
    }
  }
);

const hintStyles = cva(
  "text-sm font-normal peer-disabled:text-input-disabled-text",
  {
    variants: {
      state: {
        default: "text-text-50",
        error: "text-input-error",
        success: "text-input-success"
      }
    }
  }
);

type PropsType = ComponentProps<"textarea"> &
  VariantProps<typeof textAreaStyles> & {
    label?: string;
    hint?: string;
  };

export function TextArea({
  label,
  state = "default",
  hint,
  className,
  ...textAreaProps
}: PropsType) {
  const id = useId();

  return (
    <div className="grid grid-cols-1 gap-2">
      {label && (
        <label
          htmlFor={id}
          className="max-w-fit text-sm font-medium text-text-50 select-none"
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={cn(textAreaStyles({ state }), className)}
        {...textAreaProps}
      />

      {hint && <p className={hintStyles({ state })}>{hint}</p>}
    </div>
  );
}
