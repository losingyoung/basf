import {useState} from 'react'
import { Tabs, Input, Button, message } from 'antd';
import {signUp, signIn} from '@/api'
import { SHA256 } from "crypto-js";
import useInput from '@/hooks/useInput'
import { history } from 'umi';

const { TabPane } = Tabs;

export default function Main() {
  const [activeTab, setActiveTab] = useState('signin')
  const onSubmit = (data: SignData) => {
    const configs: {[index: string]: {fn: (data: SignData) => Promise<unknown>, msg: string}} = {
      signin: {fn: signIn, msg: 'Sign in successfully. Redirecting...'},
      signup: {fn: signUp, msg: 'Sign up successfully. Redirecting...'}
    }
    const config = configs[activeTab]
    config.fn(data).then(() => {
      message.success(config.msg, 1, () => {
        history.push('/home')
      })
    })
  };
  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Sign In" key="signin">
        </TabPane>
        <TabPane tab="Sign Up" key="signup">
        </TabPane>
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
  const [userName, userNameOnchange] = useInput('')
  const [password, passwordOnchange] = useInput('')
  const onSubmit = () => {
    if (!userName) {
      message.error('username cannot be empty')
      return
    }
    if (!password) {
      message.error('password cannot be empty')
      return
    }
    props.onSubmit({userName, passwordHash: SHA256(password + 'basf').toString()})
  }
  return (
    <>
    <div>
      <span>username:</span>
      <Input value={userName} onChange={userNameOnchange}></Input>
    </div>
    <div>
      <span>password:</span>
      <Input value={password} onChange={passwordOnchange}></Input>
    </div>
      <Button onClick={onSubmit}>Submit</Button>
    </>
  );
}
