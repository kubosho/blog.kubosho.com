import entries from '../data/entries.json';
import { TopPage } from './top/TopPage';

const entryPoint = () => {
  return <TopPage entries={entries} />;
};

export default entryPoint;
