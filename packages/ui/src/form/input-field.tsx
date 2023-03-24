import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';
import { Input } from '../atoms';

type InputFieldProps = FieldWrapperPassThroughProps &
  Required<Pick<FieldWrapperPassThroughProps, 'label'>> & {
    type?: 'text' | 'email' | 'password';
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
  };

export const InputField = (props: InputFieldProps) => {
  const { type = 'text', label, className, registration, error } = props;
  return (
    <FieldWrapper label={label} error={error}>
      <Input label={label} type={type} {...registration}/>
    </FieldWrapper>
  );
};
