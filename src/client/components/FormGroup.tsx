import * as React from 'react';

interface Props {
  field: string;
  label: string;
  value?: string;
  onChange?: (event: React.SyntheticEvent<HTMLElement>) => void;
  children?: React.ReactElement<any>;
  style?: React.CSSProperties;
  info?: React.ReactElement<any>;
}

const FormGroup = (props: Props): JSX.Element => {
  const { field, label, value, onChange, style, children, info } = props;
  const childrenProps: Pick<Props, 'value' | 'onChange' | 'style'> = {};

  childrenProps.value = value ? value : '';

  if (onChange) {
    childrenProps.onChange = onChange;
  }

  if (style) {
    childrenProps.style = style;
  }

  return (
    <div className="form-group">
      <div>
        <label htmlFor={field}>{label}</label>
      </div>
      {children ? React.cloneElement(children, childrenProps) : (
        <input {...childrenProps} />
      )}
      {!children && info}
    </div>
  );
};

export default FormGroup;
