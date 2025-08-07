import { SVGProps  } from 'react';
import styles from './Icons.module.css';

const Add = ({ className = styles.base, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={className}
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='2'
      stroke='currentColor'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
    </svg>
  );
};

export default Add;