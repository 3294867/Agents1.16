import utils from '../..';
import styles from './ContentPositioningClass.module.css';

const getContentPositioningClass = (
  side: 'top' | 'bottom' | 'left' | 'right',
  align: 'start' | 'center' | 'end'
) => {
  return styles[`content${utils.capitalizeFirstLetter(side)}${utils.capitalizeFirstLetter(align)}`];
};

export default getContentPositioningClass;