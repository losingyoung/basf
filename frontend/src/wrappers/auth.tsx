import { Redirect } from 'umi';
import useAuth from '../hooks/useAuth'
function Auth(props: React.PropsWithChildren<Record<string, unknown>>) {
  const {isSignin} = useAuth();
  if (isSignin) {
    return <div>{props.children}</div>;
  }
  return <Redirect to="/signin" />;
}

export default Auth;
