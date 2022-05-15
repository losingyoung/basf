import { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const hightEl = (
  originValue: string,
  searchWords: string | undefined,
  highlightClassName: string,
) => {
  if (!searchWords) return originValue;
  const hightlightTest = new RegExp(`(.*?)(${searchWords})(.*)`, 'i');
  const matchResult = originValue.match(hightlightTest);
  if (!matchResult) return originValue;
  return (
    <div>
      <span>{matchResult[1]}</span>
      <span className={highlightClassName}>{matchResult[2]}</span>
      <span>{matchResult[3]}</span>
    </div>
  );
};
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
      return hightEl(value.common, record.searchWords, styles.highlightText);
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
    render: (value: string[], record) => {
      if (!value) return 'N/A'
      return hightEl(value.join(','), record.searchWords, styles.highlightText)
    },
  },
];
export default columns;
