import { useContext } from 'react';
import DropdownContext from '../../components/dropdown/DropdownContext';

const useDropdownContext = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('useDropdownContext must be used within a Dropdown');
  return ctx;
};

export default useDropdownContext;