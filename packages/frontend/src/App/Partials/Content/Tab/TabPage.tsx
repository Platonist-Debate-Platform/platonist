import classnames from 'classnames';
import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import {
  encodeLink,
  Page,
  Tab as TabPageProps,
  TabItem,
} from '@platonist/library';
import { Image } from '../../Image';
import { Link } from 'react-router-dom';

export const TabPage: React.FunctionComponent<TabPageProps> = (props) => {
  const { tabItem } = props;
  const [activeTab, setActiveTab] = useState<number>(
    (tabItem && tabItem.length > 0 && tabItem[0]?.id) || 1,
  );

  const toggle = (id: TabItem<Page>['id']) => {
    if (activeTab !== id) setActiveTab(id);
  };

  return tabItem && tabItem.length > 0 ? (
    <section className="tab-section">
      <div className="tab-section-nav">
        <Nav>
          {tabItem.map((tab, index) => {
            return tab ? (
              <NavItem
                key={`tab_page_nav_${tab.id}_${index}`}
                className={classnames({ active: activeTab === tab.id })}
              >
                <NavLink
                  className={classnames({ active: activeTab === tab.id })}
                  onClick={() => {
                    toggle(tab.id);
                  }}
                >
                  {tab.icon && (
                    <span className="nav-icon">
                      <i className={`icon-${tab.icon || 'globe'}`} />
                    </span>
                  )}
                  <span className="nav-text">
                    {tab.title}
                    <i className="icon icon-arrow-right" />
                  </span>
                </NavLink>
              </NavItem>
            ) : null;
          })}
        </Nav>
      </div>
      <div className="tab-section-content">
        <TabContent activeTab={activeTab}>
          {tabItem.map((tab, index) => {
            return tab ? (
              <TabPane key={`tab_page_pane_${tab.id}_${index}`} tabId={tab.id}>
                {tab.media && (
                  <Image className="tab-section-background" {...tab.media} />
                )}
                <div className="tab-section-text">
                  <h3>
                    <>{tab.lead ? tab.lead : tab.title}</>
                  </h3>
                  {tab.teaser && <p className="lead">{tab.teaser}</p>}
                  {tab.item && (
                    <Link
                      className={'btn btn-ghost btn-sized mt-3'}
                      to={'/' + encodeLink(tab.item.title)}
                      title={tab.item.title}
                    >
                      {tab.callToAction
                        ? tab.callToAction
                        : `Go to ${tab.item.title}`}
                    </Link>
                  )}
                </div>
              </TabPane>
            ) : null;
          })}
        </TabContent>
      </div>
    </section>
  ) : null;
};

export default TabPage;
