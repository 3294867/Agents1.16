import { SVGProps  } from 'react';
import utils from 'src/utils';
import styles from './Icons.module.css';

const Add = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={utils.cn(styles.base, className)}
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