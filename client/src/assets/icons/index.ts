import { SVGProps, JSX } from 'react';
import Add from './Add';
import Close from './Close';
import Pause from './Pause';
import Run from './Run';
import Edit from './Edit';
import Move from './Move';
import Share from './Share';
import Delete from './Delete';
import BookmarkOutlined from './BookmarkOutlined';
import BookmarkFilled from './BookmarkFilled';
import More from './More';
import LightMode from './LightMode';
import DarkMode from './DarkMode';
import Loader from './Loader';
import History from './History';
import Send from './Send';
import Library from './Library';
import Settings from './Settings';
import ChevronDown from './ChevronDown';
import Logout from './Logout';
import EyeClosed from './EyeClosed';
import EyeOpened from './EyeOpened';
import CircleAlert from './CircleAlert';

type IconProps = SVGProps<SVGSVGElement>

interface IconComponents {
  [key: string]: (props: IconProps) => JSX.Element;
}

const Icons: IconComponents = {
  Add,
  Close,
  Pause,
  Run,
  Edit,
  Move,
  Share,
  Delete,
  BookmarkOutlined,
  BookmarkFilled,
  More,
  LightMode,
  DarkMode,
  Loader,
  History,
  Send,
  Library,
  Settings,
  ChevronDown,
  Logout,
  EyeClosed,
  EyeOpened,
  CircleAlert
};

export default Icons;