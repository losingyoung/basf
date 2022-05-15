import styles from './index.less';
import { getCountries, updateFavorites } from '@/api';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Table, Input, Checkbox, message, Button, Row, Col, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import useInput from '@/hooks/useInput';
import { debounce } from 'lodash';
import StatelessColumns from './tableColumn';
import BarChart from '@/components/bar-chart';
import * as echarts from 'echarts';
import {CloseCircleOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
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
        const Icon = value ? HeartFilled : HeartOutlined
        return (
          <div>
            <Icon style={{color: '#ff0c0c', fontSize: '24px'}} onClick={() => {
                onClickFavorite(record.area, !value);
              }}></Icon>
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

  // 展示图表
  const [displayChart, setDisplayChart] = useState(false);
  // 图表配置
  const [chartOptions, setChartOptions] = useState<echarts.EChartsCoreOption>(
    {},
  );
  const getFilteredRows = () => {
    return tableData.filter((data) => {
      if (selectedRowKeys.includes(data.area)) {
        return true;
      }
      return false;
    });
  }
  const setPopulationChart = (filteredShowRows: CountriesTableData[]) => {
    setChartOptions({
      title: {
        text: 'Population',
      },
      // 图表内边距
      grid: {
        x: 100, //默认是80px
        y: 50, //默认是60px
        x2: 20, //默认80px
        y2: 50, //默认60px
      },
      tooltip: {},
      xAxis: {
        // 解决有的文字过长显示不全的问题
        axisLabel:{
          interval: 0,
          formatter: (value: string, index: number) => {
            if (index % 2 === 0){
              return value
            }
            return '\n\n' + value
          }
        },
        data: filteredShowRows.map((data) => data.name.common),
      },
      yAxis: {},
      series: [
        {
          name: 'population',
          type: 'bar',
          data: filteredShowRows.map((data) => data.population),
        },
      ],
    });
  };
  // 点击展示按钮
  const onClickShowChart = () => {
    const filteredShowRows = getFilteredRows()
    if (filteredShowRows.length === 0) {
      return message.warn('select at least one row');
    }
    if (displayChart) {
      return setPopulationChart(filteredShowRows);
    }
    setDisplayChart(true);
    // transition有问题时兜底
    setTimeout(() => setPopulationChart(filteredShowRows), 1000);
  };
  const closeChart = () => {
    setDisplayChart(false);
  };
  const onColTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (
    e,
  ) => {
    const { propertyName } = e;
    if (propertyName !== 'max-width' && propertyName !== 'flex-basis' || !displayChart) return;
    onClickShowChart();
  };
  return (
    <Row className={styles.bodyRow}>
      <Col
        className={styles.contentCol}
        span={displayChart ? 12 : 24}
        onTransitionEnd={onColTransitionEnd}
      >
        <div className={styles.tableOperations}>
          <Space className={styles.searchRow}>
            <Space>
              <Input
                placeholder="Search"
                value={searchWords}
                onChange={setSearchWords}
              ></Input>
            </Space>
            <Checkbox
              checked={showFavorites}
              onChange={(e) => setShowFavorites(e.target.checked)}
            >
              favorites
            </Checkbox>
            <Button onClick={onClickShowChart} type='primary'>show population</Button>
          </Space>
          <div>
            <Button className={styles.cancelButton} onClick={onCancelSelections}>cancel selections</Button>
          </div>
        </div>
        <Table
        size='middle'
          rowSelection={rowSelection}
          className={styles.table}
          rowKey="area"
          dataSource={tableData}
          columns={columns}
        />
      </Col>
      <Col span={displayChart ? 12 : 0} className={styles.contentCol}>
        <div className={styles.chartPlaceholder}></div>
        <BarChart height={400} options={chartOptions}></BarChart>
        <div className={styles.chartCloseWrapper}>
        <CloseCircleOutlined style={{fontSize: '20px'}}className={styles.chartCloseBtn} onClick={closeChart} />
        </div>
       
      </Col>
    </Row>
  );
}
