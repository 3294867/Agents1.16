import { useEffect, useState } from 'react';
import constants from 'src/constants';

interface Props {
  threadBodyLength: number;
}

/** Handles SideNav (UI) */
const useHandleSideNav = ({ threadBodyLength }: Props): { isVisible: boolean, chatWidth: number } => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [chatWidth, setChatWidth] = useState<number>(0);
  
  useEffect(() => {
    const update = () => {
      const chatElement = document.getElementById('chat');
      if (!chatElement) return;
      
      const viewportHeight = window.innerHeight;
      const chatHeight = chatElement.offsetHeight;
      const chatWidth = chatElement.offsetWidth;
      
      if (threadBodyLength >= constants.queriesMinNumber && chatHeight > viewportHeight) {
        setIsVisible(true);
      }

      setChatWidth(chatWidth);
    }
    update();

    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  },[threadBodyLength]);

  return { isVisible, chatWidth };
};

export default useHandleSideNav;