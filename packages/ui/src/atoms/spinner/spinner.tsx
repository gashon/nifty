import { FC } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { IconBaseProps } from 'react-icons/lib';

type SpinnerProps = IconBaseProps & {
  animation?: string;
  className?: string;
  style?: React.CSSProperties;
};
export const Spinner: FC<SpinnerProps> = ({ size, color, title, animation, className, style }) => (
  <div
    className={className}
    style={{ animation: animation || 'spin 2s linear infinite', ...(style || {}) }}
  >
    <CgSpinner size={size} color={color} title={title} />
  </div>
);
