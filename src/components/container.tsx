import { forwardRef } from 'react';
import classNames from 'classnames';

import { Handle } from './item-handle';
import { Remove } from './item-remove';

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  className?: string;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      className,
      ...props
    }: Props,
    ref
  ) => {
    const Component = onClick ? 'button' : 'div';

    return (
      <Component
        {...props}
        ref={ref as any}
        style={
          {
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        className={classNames(
          'flex flex-col overflow-hidden box-border outline-none min-w-[350px] m-3 rounded-md min-h-[100px] transition-colors border font-[1em] bg-gray-200',
          unstyled && 'overflow-visible bg-transparent border-none',
          horizontal && 'w-full',
          hover && 'bg-slate-100',
          placeholder &&
            'content-center items-center cursor-pointer text-black text-opacity-90 border-dashed border-gray-500 hover:border-opacity-90',
          shadow && 'shadow-md',
          className
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <div className="flex p-4 pr-2 items-center justify-between group font-bold">
            {label}
            <div className="flex mr-3 transition">
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              {handleProps ? <Handle {...handleProps} /> : undefined}
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </Component>
    );
  }
);
