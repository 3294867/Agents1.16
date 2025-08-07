import { SVGProps } from 'react';
import styles from './Icons.module.css';

const Move = ({ className = styles.base, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={className}
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M3 5v14'/><path d='M21 12H7'/><path d='m15 18 6-6-6-6'/>
    </svg>
  );
};

export default Move;