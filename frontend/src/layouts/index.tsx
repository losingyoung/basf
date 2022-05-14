import styles from './index.less'
import { Layout } from 'antd';
import Header from '@/components/header'

const { Footer, Sider, Content } = Layout;

export default function layout(props: React.PropsWithChildren<{ location: { pathname: string } }>){
  return (
    <Layout>
      <Header></Header>
      <Content>{props.children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  )
}