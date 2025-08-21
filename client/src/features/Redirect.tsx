import hooks from 'src/hooks';

interface Props {
  userId: string;
}

const Redirect = ({ userId }: Props) => {
  hooks.features.useHandleRedirect({ userId });
  return null;
};

export default Redirect;
 