import styles from './index.less';
import { SHA256 } from "crypto-js";
// import dayjs from 'dayjs'
// import customParseFormat from 'dayjs/plugin/customParseFormat'
// dayjs.extend(customParseFormat)
export default function IndexPage() {
  console.log(SHA256('').toString())
  // dayjs(last_login_at).format('YYYY-MM-DD，HH:mm:ss').toString()
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
