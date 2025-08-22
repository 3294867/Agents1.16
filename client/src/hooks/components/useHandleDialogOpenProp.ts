import { useEffect } from 'react';
import useDialogContext from '../../hooks/components/useDialogContext';

interface Props {
  open?: boolean;
}

const useHandleDialogOpenProp = ({ open }: Props): void => {
  const { setIsOpen } = useDialogContext();

  useEffect(() => {
    if (open) setIsOpen(open);
  },[open]);
};

export default useHandleDialogOpenProp;