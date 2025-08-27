import { SVGProps } from 'react';
import utils from 'src/utils';
import styles from './Icons.module.css';

const Send = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
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
      <path d='M13 5H19V11'/><path d='M19 5L5 19'/>
    </svg>
  );
};

export default Send;