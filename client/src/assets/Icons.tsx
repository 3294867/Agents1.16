import { JSX, SVGProps } from 'react';
import styles from './Icons.module.css';

/** Icon sources:
 * https://lucide.dev/icons/
 * https://www.radix-ui.com/icons
 */

type IconProps = SVGProps<SVGSVGElement>

interface IconComponents {
  [key: string]: (props: IconProps) => JSX.Element;
}

const Icons: IconComponents = {
  Add: ({ className = styles.base, ...props }) => {
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
  },
  Close: ({ className = styles.base, ...props }) => {
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
          <path d='M18 6 6 18'/><path d='m6 6 12 12'/>
        </svg>
    );
  },
  Pause: ({ className, ...props }) => {
    return (
      <svg
        className={className}
        {...props}
        width='15'
        height='15'
        viewBox='0 0 15 15'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z' fill='currentColor' fillRule='evenodd' clipRule='evenodd'></path>
      </svg>
    );
  },
  Run: ({ className, ...props }) => {
    return (
      <svg
        className={className}
        {...props}
        width='15'
        height='15'
        viewBox='0 0 15 15'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z' fill='currentColor' fillRule='evenodd' clipRule='evenodd'></path>
      </svg>
    );
  },
  Edit: ({ className = styles.base, ...props }) => {
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
        <path d='M13 21h8'/><path d='m15 5 4 4'/><path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'/>
      </svg>
    );
  },
  Move: ({ className = styles.base, ...props }) => {
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
  },
  Share: ({ className = styles.base, ...props }) => {
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
        <path d='M12 2v13'/><path d='m16 6-4-4-4 4'/><path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'/>
      </svg>
    );
  },
  Delete: ({ className = styles.base, ...props }) => {
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
        <path d='M10 11v6'/><path d='M14 11v6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'/><path d='M3 6h18'/><path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/>
      </svg>
    );
  },
  BookmarkOutlined: ({ className = styles.base, ...props }) => {
    return (
      <svg
        className={className}
        {...props}
        width='15'
        height='15'
        viewBox='0 0 15 15'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M3 2.5C3 2.22386 3.22386 2 3.5 2H11.5C11.7761 2 12 2.22386 12 2.5V13.5C12 13.6818 11.9014 13.8492 11.7424 13.9373C11.5834 14.0254 11.3891 14.0203 11.235 13.924L7.5 11.5896L3.765 13.924C3.61087 14.0203 3.41659 14.0254 3.25762 13.9373C3.09864 13.8492 3 13.6818 3 13.5V2.5ZM4 3V12.5979L6.97 10.7416C7.29427 10.539 7.70573 10.539 8.03 10.7416L11 12.5979V3H4Z' fill='currentColor' fillRule='evenodd' clipRule='evenodd'></path>
      </svg>
    );
  },
  BookmarkFilled: ({ className, ...props }) => {
    return (
     <svg
      className={className}
      {...props}
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z' fill='currentColor' fillRule='evenodd' clipRule='evenodd'></path>
    </svg>
    );
  },
  More: ({ className = styles.base, ...props }) => {
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
        <circle cx='12' cy='12' r='1'/><circle cx='12' cy='5' r='1'/><circle cx='12' cy='19' r='1'/>
      </svg>
    );
  },
  LightMode: ({ className = styles.base, ...props }) => {
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
        <circle cx='12' cy='12' r='4'/><path d='M12 3v1'/><path d='M12 20v1'/><path d='M3 12h1'/><path d='M20 12h1'/><path d='m18.364 5.636-.707.707'/><path d='m6.343 17.657-.707.707'/><path d='m5.636 5.636.707.707'/><path d='m17.657 17.657.707.707'/>
      </svg>
    );
  },
  DarkMode: ({ className = styles.base, ...props }) => {
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
        <path d='M18 5h4'/><path d='M20 3v4'/><path d='M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401'/>
      </svg>
    );
  },
  Loader: ({ className = styles.base, ...props }) => {
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
        <path d='M12 2v4'/><path d='m16.2 7.8 2.9-2.9'/><path d='M18 12h4'/><path d='m16.2 16.2 2.9 2.9'/><path d='M12 18v4'/><path d='m4.9 19.1 2.9-2.9'/><path d='M2 12h4'/><path d='m4.9 4.9 2.9 2.9'/>
      </svg>
    );
  },
  History: ({ className = styles.base, ...props }) => {
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
        <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'/><path d='M3 3v5h5'/><path d='M12 7v5l4 2'/>
      </svg>
    );
  },
  Send: ({ className = styles.base, ...props }) => {
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
        <path d='M13 5H19V11'/><path d='M19 5L5 19'/>
      </svg>
    );
  },
  Library: ({ className = styles.base, ...props }) => {
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
        <path d='M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'/><path d='M2 10h20'/>
      </svg>
    );
  },
  Settings: ({ className = styles.base, ...props }) => {
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
      <path d='M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915'/><circle cx='12' cy='12' r='3'/>
    </svg>
    );
  },
  ChevronDown: ({ className = styles.base, ...props }) => {
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
          <path d='m6 9 6 6 6-6'/>
      </svg>
    );
  },
};

export default Icons;