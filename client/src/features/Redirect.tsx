import hooks from 'src/hooks';

interface RedirectProps {
  userId: string;
};

const Redirect = (props: RedirectProps) => {
  hooks.useHandleRedirect({ userId: props.userId });
  return null;
};

export default Redirect;
 