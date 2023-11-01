import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'Tsihai';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '智能 BI',
          title: '智能 BI',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Tsihai',
          blankTarget: true,
        },
        {
          key: 'Tsihai',
          title: 'Tsihai',
          href: 'https://tsihai.github.io',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
