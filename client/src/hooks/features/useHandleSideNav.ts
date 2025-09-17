import { useEffect, useState } from 'react';
import constants from 'src/constants';

interface Props {
  threadBodyLength: number;
}

interface Return {
  isVisible: boolean;
  chatWidth: number;
}

const useHandleSideNav = ({ threadBodyLength }: Props): Return => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [chatWidth, setChatWidth] = useState<number>(0);
  
  useEffect(() => {
    const update = () => {
      const chatElement = document.getElementById('chat');
      if (!chatElement) return;
      
      const viewportHeight = window.innerHeight;
      const chatHeight = chatElement.offsetHeight;
      const chatWidth = chatElement.offsetWidth;
      
      if (threadBodyLength >= constants.reqresMinNumber && chatHeight > viewportHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
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