import Cookies from 'js-cookie'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export default function useAuth () {
  const userName = Cookies.get('user_name')
  const lastSigninTimestamp = Cookies.get('last_signin_time')
  if (!userName || !lastSigninTimestamp) return {isSignin: false}
  return {
    signOut,
    isSignin: true,
    userName,
    lastSigninTime: dayjs(parseInt(lastSigninTimestamp, 10)).format('YYYY-MM-DD，HH:mm:ss').toString()
  }
}

export function signOut() {
  Cookies.remove('user_name')
  Cookies.remove('last_signin_time')
  Cookies.remove('signin_session')
}