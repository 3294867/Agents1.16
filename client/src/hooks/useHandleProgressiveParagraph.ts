import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';

interface Props {
  threadId: string;
  responseId: string;
  responseBody: string;
};

const useHandleProgressiveParagraph = ({ threadId, responseId, responseBody }: Props): string => {
  const [copy, setCopy] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const animate = () => {
      return new Promise<void>((resolve) => {
        let i = 0;
        timer = setInterval(() => {
          if (i < responseBody.length) {
            setCopy(responseBody.slice(0, i + 1));
            i++;
          } else {
            clearInterval(timer);
            resolve();
          }
        },12);
      });
    };

    animate().then(() => {
      indexedDB.updateQueryIsNewProp({
        threadId, responseId, isNew: false
      });
    });
        
    return () => clearInterval(timer);
  },[responseBody, threadId, responseId]);

  return copy
};

export default useHandleProgressiveParagraph;