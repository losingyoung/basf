import { Layout, Menu, Dropdown, Space } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import useAuth from '@/hooks/useAuth';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { history } from 'umi';
import styles from './index.less'
const { Header } = Layout;

dayjs.extend(customParseFormat)

export default function H() {
  const { signOut, userName, lastSigninTime } = useAuth();
  const menu = (
    <Menu
      items={[
        {
          key: 'signout',
          label: 'Sign out',
          onClick: () => {
            signOut && signOut();
            history.push('/signin');
          },
        },
      ]}
    ></Menu>
  );
  return (
    <Header className={styles.header}>
        <div>Last signin time: {lastSigninTime || 'unknown'}</div>
        <Dropdown overlay={menu}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <span className={styles.userName}>{userName}</span> 
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
    </Header>
  );
}
