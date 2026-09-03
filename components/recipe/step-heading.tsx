import type { ReactNode } from 'react';

type Props = {
  number: string;
  label: string;
  titleId: string;
  title: string;
  children?: ReactNode;
};

/** The numbered heading block every recipe step opens with. */
export function StepHeading({
  number,
  label,
  titleId,
  title,
  children,
}: Props) {
  return (
    <div className="step-heading">
      <span className="step-number">{number}</span>
      <div>
        <p className="utility-label">{label}</p>
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
