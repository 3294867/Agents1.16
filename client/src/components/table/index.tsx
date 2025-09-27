import * as React from 'react';
import utils from 'src/utils';
import styles from './Table..module.css';

const Root = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className={styles.rootWrapper}>
    <table ref={ref} className={utils.cn(styles.root, className)} {...props} />
  </div>
));
Root.displayName = 'Root';

const Header = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={utils.cn(styles.header, className)} {...props} />
));
Header.displayName = 'Header';

const Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={utils.cn(styles.body, className)} {...props} />
));
Body.displayName = 'Body';

const Footer = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={utils.cn(styles.footer, className)} {...props} />
));
Footer.displayName = 'Footer';

const Row = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={utils.cn(styles.row, className)} {...props} />
));
Row.displayName = 'Row';

const Head = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={utils.cn(styles.head, className)} {...props} />
));
Head.displayName = 'Head';

const Cell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={utils.cn(styles.cell, className)} {...props} />
));
Cell.displayName = 'Cell';

const Caption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={utils.cn(styles.caption, className)} {...props} />
));
Caption.displayName = 'Caption';

const Table = {
  Root,
  Header,
  Body,
  Footer,
  Row,
  Head,
  Cell,
  Caption,
};

export default Table;
