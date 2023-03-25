import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';
import { Input } from '../atoms';

type InputFieldProps = FieldWrapperPassThroughProps &
  Required<Pick<FieldWrapperPassThroughProps, 'label'>> & {
    type?: 'text' | 'email' | 'password';
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
    disabled?: boolean;
  };

export const InputField = (props: InputFieldProps) => {
  const { type = 'text', label, registration, error, disabled } = props;
  return (
    <FieldWrapper label={label} error={error}>
      <Input label={label} type={type} registration={registration} disabled={disabled} />
    </FieldWrapper>
  );
};
