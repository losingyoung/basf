import styles from './index.less';
import { getCountries, updateFavorites } from '@/api';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Table, Input, Button, Checkbox } from 'antd';
import { ColumnsType } from 'antd/es/table';
import useInput from '@/hooks/useInput';
import { debounce } from 'lodash';
import StatelessColumns from './tableColumn';
import BarChart from '@/components/bar-chart'
// 把收藏列表数据塞到表格数据中
function setDataFavorites(
  tableData: Array<CountriesTableData>,
  favorites: number[],
) {
  return tableData.map((data) => {
    let favorite = false;
    if (favorites.includes(data.area)) {
      favorite = true;
    }
    return { ...data, favorite };
  });
}

export default function IndexPage() {
  // 表格列
  const columns: ColumnsType<CountriesTableData> = StatelessColumns.concat([
    {
      title: 'favorites',
      dataIndex: 'favorite',
      key: 'favorite',
      render: (value: boolean | undefined, record) => {
        console.log(value, record);
        return (
          <div>
            {value && '???'}
            <Button
              onClick={() => {
                onClickFavorite(record.area, !value);
              }}
            >
              收藏？
            </Button>
          </div>
        );
      },
    },
  ]);
  // checkbox选中的数据 包括筛选/未筛选的
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  // 请求回来的所有数据
  const allTableData = useRef<CountriesTableData[]>([]);
  // 当前展示的数据 可能被搜索筛选过，少于所有数据
  const [tableData, setTableData] = useState<CountriesTableData[]>([]);
  // 搜索关键字
  const [searchWords, setSearchWords] = useInput('');

  const [favorites, setFavorites] = useState<number[]>([]);
  // 页面载入请求
  useEffect(() => {
    getCountries().then((data) => {
      // 保存所有数据，初始化所有数据
      const facoritesIdArr =
        (data.favorites &&
          data.favorites.split(',').map((str) => parseInt(str, 10))) ||
        [];
      const withFavoriteData = setDataFavorites(data.countries, facoritesIdArr);
      allTableData.current = withFavoriteData;
      setTableData(withFavoriteData);
      setFavorites(facoritesIdArr);
    });
  }, []);
  const [showFavorites, setShowFavorites] = useState(false);
  // 搜索功能
  const filterTableData = useCallback(
    debounce((searchWords: string, showFavorites: boolean) => {
      const filteredData: CountriesTableData[] = allTableData.current
        .filter((data) => {
          // name captital匹配
          if (
            new RegExp(searchWords, 'i').test(data.name.common) ||
            new RegExp(searchWords, 'i').test((data.capital || []).join(''))
          ) {
            if (showFavorites && !data.favorite) return false;
            return true;
          }
          return false;
        })
        .map((data) => {
          return { searchWords, ...data };
        });
      setTableData(filteredData);
    }, 400),
    [],
  );
  useEffect(() => {
    filterTableData(searchWords, showFavorites);
  }, [searchWords, showFavorites]);

  // 页面选择逻辑
  const rowSelection = {
    selectedRowKeys,
    onChange: (selected: Array<number | string>) => {
      setSelectedRowKeys(selected as Array<number>);
    },
  };
  const onCancelSelections = () => {
    setSelectedRowKeys([]);
  };

  // 点击收藏按钮
  const onClickFavorite = (id: number, favorite: boolean) => {
    let newFavorites: number[];
    if (favorite) {
      newFavorites = favorites.concat([id]);
      setFavorites(newFavorites);
    } else {
      newFavorites = favorites.filter((data) => data !== id);
      setFavorites(newFavorites);
    }
    updateFavorites(newFavorites.join(',')).then(() => {
      // 改变总数据源
      allTableData.current = setDataFavorites(
        allTableData.current,
        newFavorites,
      );
      setTableData(setDataFavorites(tableData, newFavorites));
    });
  };
  const showChart = () => {
    // console.log(tableData, selectedRowKeys)
    const filteredShowRows = tableData.filter((data) => {
      if (selectedRowKeys.includes(data.area)) {
        return true;
      }
      return false;
    });
    console.log(filteredShowRows);
  };

  return (
    <div>
      <div>
        search: <Input value={searchWords} onChange={setSearchWords}></Input>
      </div>
      <div>
        <Button onClick={onCancelSelections}>cancel selections</Button>
      </div>
      <div>
        <Button onClick={showChart}>show population</Button>
      </div>
      <div>
        <Checkbox
          checked={showFavorites}
          onChange={(e) => setShowFavorites(e.target.checked)}
        >
          favorites
        </Checkbox>
      </div>
      <Table
        rowSelection={rowSelection}
        className={styles.table}
        rowKey="area"
        dataSource={tableData}
        columns={columns}
      />
      <BarChart  height={300} data={[]}></BarChart>
    </div>
  );
}
