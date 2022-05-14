import { useState } from 'react';
import {ChangeEventHandler} from 'react'

export default function useInput(defaultValue = ''): [string, ChangeEventHandler<HTMLInputElement>] {
  const [value, setValue] = useState(defaultValue);
  const onChange:ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };
  return [value, onChange];
}
