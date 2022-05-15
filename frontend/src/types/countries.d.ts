interface CountriesName {
  common: string;
  official: string;
}
//后台返回的表格数据
interface CountriesData {
  region: string;
  capital: string[];
  name: CountriesName;
  flags: string[];
  area: number;
  population: number;
}
// 表格渲染用的数据
interface CountriesTableData extends CountriesData {
  searchWords?: string;
  selected?: boolean;
  favorite?: boolean;
}
