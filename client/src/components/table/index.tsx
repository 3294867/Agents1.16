import * as React from 'react';
import utils from 'src/utils';
import styles from './Table.module.css';

const Root = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.rootWrapper, className)} {...props} />
));
Root.displayName = 'Root';

const Actions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.actions, className)} {...props}>
    {children}
  </div>
));
Actions.displayName = 'Actions';

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.header, className)} {...props} />
));
Header.displayName = 'Header';

const Body = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.body, className)} {...props} />
));
Body.displayName = 'Body';

const Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.footer, className)} {...props} />
));
Footer.displayName = 'Footer';

const Row = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.row, className)} {...props} />
));
Row.displayName = 'Row';

const Head = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.head, className)} {...props} />
));
Head.displayName = 'Head';

const Cell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.cell, className)} {...props}>
    {children}
  </div>
));
Cell.displayName = 'Cell';

const Caption = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={utils.cn(styles.caption, className)} {...props} />
));
Caption.displayName = 'Caption';

const Table = {
  Root,
  Actions,
  Header,
  Body,
  Footer,
  Row,
  Head,
  Cell,
  Caption,
};

export default Table;
