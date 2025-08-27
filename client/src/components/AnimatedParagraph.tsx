import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Paragraph from './paragraph';

interface Props {
  copy: string;
}

const AnimatedParagraph = forwardRef<HTMLDivElement, Props>(
  ({ copy, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        <Paragraph variant='thin' style={{ lineHeight: '2' }}>
          {copy}
        </Paragraph>
      </motion.div>
    );
  }
);
AnimatedParagraph.displayName = 'AnimatedParagraph';

export default AnimatedParagraph;