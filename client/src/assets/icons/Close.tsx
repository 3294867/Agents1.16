import { SVGProps } from 'react';
import utils from 'src/utils';
import styles from './Icons.module.css';

const Close = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={utils.cn(styles.base, className)}
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
      <path d='M18 6 6 18'/><path d='m6 6 12 12'/>
    </svg>
  );
};

export default Close;