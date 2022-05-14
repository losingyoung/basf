import { ColumnsType } from 'antd/es/table';
import styles from './index.less'

const columns: ColumnsType<CountriesTableData> = [
  {
    title: 'flag',
    key: 'flags',
    dataIndex: 'flags',
    render: (value: string[], record) => {
      return (
        <img
          className={styles.flagImg}
          src={value[0]}
          alt={`flag of ${record.name.common}`}
        />
      );
    },
  },
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.common.localeCompare(b.name.common),
    render: (value: CountriesName, record) => {
      return value.common;
    },
  },
  {
    title: 'region',
    dataIndex: 'region',
    key: 'region',
    sorter: (a, b) => a.region.localeCompare(b.region),
  },
  {
    title: 'capital',
    dataIndex: 'capital',
    key: 'capital',
    sorter: (a, b) =>
      (a.capital || ['N/A'])
        .join(',')
        .localeCompare((b.capital || ['N/A']).join(',')),
    render: (value: string[]) => {
      return (value || ['N/A']).join(',');
    },
  },
];
export default columns;
