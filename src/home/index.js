import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import D3Tree from '../../components/D3Tree';
import config from '../../config';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = config.title;
  }

  render() {
    return (
      <Layout className={s.content}>
        <D3Tree treeData={config.data} />
      </Layout>
    );
  }

}

export default HomePage;
