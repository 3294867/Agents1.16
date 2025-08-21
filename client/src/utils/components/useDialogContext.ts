import { useContext } from 'react';
import DialogContext from '../../components/dialog/DialogContext';

const useDialogContext = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialogContext must be within a Dialog');
  return ctx;
};

export default useDialogContext;