import React from 'react';
import { Link } from 'dva/router';
import Exception from 'components/Exception';
import img from '../../assets/error-400.png';

export default () => (
  <Exception type="400" style={{ minHeight: 500, height: '80%' }} linkElement={Link} img={img} />
);
