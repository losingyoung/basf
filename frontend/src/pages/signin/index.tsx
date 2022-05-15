import { useState } from 'react';
import { Tabs, Input, Button, message, Row, Col } from 'antd';
import { signUp, signIn } from '@/api';
import { SHA256 } from 'crypto-js';
import useInput from '@/hooks/useInput';
import { history } from 'umi';
import styles from './index.less';
const { TabPane } = Tabs;

export default function Main() {
  const [activeTab, setActiveTab] = useState('signin');
  const onSubmit = (data: SignData) => {
    const configs: {
      [index: string]: {
        fn: (data: SignData) => Promise<unknown>;
        msg: string;
      };
    } = {
      signin: { fn: signIn, msg: 'Sign in successfully. Redirecting...' },
      signup: { fn: signUp, msg: 'Sign up successfully. Redirecting...' },
    };
    const config = configs[activeTab];
    config.fn(data).then(() => {
      message.success(config.msg, 1, () => {
        history.push('/home');
      });
    });
  };
  return (
    <div className={styles.signinBox}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Sign In" key="signin"></TabPane>
        <TabPane tab="Sign Up" key="signup"></TabPane>
        {/* <SignInput onSubmit={(data) => {onSubmit(data, 'signin')}}></SignInput> */}
      </Tabs>
      <SignInput onSubmit={onSubmit}></SignInput>
    </div>
  );
}

interface SignInputProps {
  onSubmit: (data: SignData) => void;
}
function SignInput(props: SignInputProps) {
  const [userName, userNameOnchange] = useInput('');
  const [password, passwordOnchange] = useInput('');
  const onSubmit = () => {
    if (!userName || userName.length < 5) {
      message.error('username\'s length should be above 5');
      return;
    }
    if (!password|| password.length < 8) {
      message.error('password\'s length should be above 8');
      return;
    }
    props.onSubmit({
      userName,
      passwordHash: SHA256(password + 'basf').toString(),
    });
  };
  return (
    <div className={styles.inputWrapper}>
      <Row className={styles.inputRow}>
        <Col span={8}>
          <span>username:</span>
        </Col>
        <Col span={16}>
          <Input value={userName} onChange={userNameOnchange}></Input>
        </Col>
      </Row>
      <Row className={styles.inputRow}>
        <Col span={8}>
          <span>password:</span>
        </Col>
        <Col span={16}>
          <Input type='password' value={password} onChange={passwordOnchange}></Input>
        </Col>
      </Row>
      <Row justify="center" className={styles.inputRow}>
        <Col span={24}>
          <Button
            type="primary"
            className={styles.submitBtn}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
}
