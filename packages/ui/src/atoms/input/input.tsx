/* eslint-disable jsx-a11y/label-has-associated-control */
import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type InputProps = Pick<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'required' | 'defaultValue' | 'disabled'
> & {
  label: string;
  registration?: Partial<UseFormRegisterReturn>;
  disabled?: boolean;
} & Partial<UseFormRegisterReturn>;

// Based on https://play.tailwindcss.com/asmAkefxLr
export const Input: FC<InputProps> = ({
  label,
  type,
  registration,
  ...rest
}) => (
  <div className="group relative w-full">
    <input
      {...rest}
      type={type}
      data-testid="input-atom"
      className={
        'text-black peer w-full bg-transparent px-3 py-3 outline-none transition-colors'
      }
      placeholder=" "
      style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
      autoComplete="off"
      {...registration}
    />

    <label
      className="pointer-events-none absolute left-[9px] top-px -translate-y-1/2 transform px-1 text-sm text-zinc-500 transition-all duration-300
  group-focus-within:!top-px group-focus-within:!text-sm group-focus-within:!text-primary-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base"
    >
      {label}
    </label>

    <fieldset
      className="pointer-events-none invisible absolute inset-0 mt-[-9px] rounded border border-zinc-600 transition-colors group-focus-within:border-2
  group-focus-within:!border-primary-500 group-hover:border-zinc-700 peer-placeholder-shown:visible border-tertiary"
    >
      <legend className="invisible ml-2 max-w-[0.01px] whitespace-nowrap px-0 text-sm transition-all duration-300 group-focus-within:max-w-full group-focus-within:px-1">
        {label}
      </legend>
    </fieldset>

    <fieldset
      className="pointer-events-none visible absolute inset-0 mt-[-9px] rounded border border-zinc-600 transition-colors group-focus-within:border-2
  group-focus-within:!border-primary-500 group-hover:border-zinc-700 peer-placeholder-shown:invisible border-tertiary"
    >
      <legend className="invisible ml-2 max-w-full whitespace-nowrap px-1 text-sm">
        {label}
      </legend>
    </fieldset>
  </div>
);

/* eslint-enable jsx-a11y/label-has-associated-control */
