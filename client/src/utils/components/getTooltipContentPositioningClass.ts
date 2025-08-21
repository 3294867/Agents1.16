import utils from '..';
import styles from 'src/components/tooltip/Tooltip.module.css';

const getTooltipContentPositioningClass = (
  side: 'top' | 'bottom' | 'left' | 'right',
  align: 'start' | 'center' | 'end'
) => {
  return styles[`tooltipContent${utils.capitalizeFirstLetter(side)}${utils.capitalizeFirstLetter(align)}`];
};

export default getTooltipContentPositioningClass;