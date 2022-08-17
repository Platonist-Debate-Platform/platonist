import './ArticleItem.scss';

import React, { FunctionComponent } from 'react';

import { Article } from '@platonist/library';

const trimString = (str: string, max: number = 115) => {
  let trimmed = str.substr(0, max);
  if (str.length > trimmed.length) {
    trimmed =
      trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' '))) +
      '...';
  }
  return trimmed;
};

export const ArticleItem: FunctionComponent<Article> = ({
  description,
  icon,
  image,
  provider,
  title,
  url,
}) => {
  /**
   * Redirects the user to the article by opening a new tab.
   */
  const openArticle = () => {
    window.open(url, '_blank');
  };
  return (
    <>
      <div key={url} className="debate-article-container" onClick={openArticle}>
        <div className="debate-article">
        <div className="shadow p-3 mb-3 bg-white rounded">
          <div className="debate-article-inner">
            <div className="debate-article-image">
              {image ? (
                <img className="img-fluid" src={image} alt={title} />
              ) : (
                <></>
              )}
            </div>
            <div className="debate-article-icon">
              {icon ? (
                <img className="img-fluid" src={icon} alt={provider} />
              ) : (
                <></>
              )}
            </div>
            <div className="debate-article-content">
              <h4 className="mb-2">{title}</h4>
              <p title={description}>{trimString(description)}</p>
          <div className="shadow p-3 mb-3 bg-white rounded">
            <div className="debate-article-inner">
              <div className="debate-article-image">
                {image ? (
                  <img className="img-fluid" src={image} alt={title} />
                ) : (
                  <></>
                )}
              </div>
              <div className="debate-article-icon">
                {icon ? (
                  <img className="img-fluid" src={icon} alt={provider} />
                ) : (
                  <></>
                )}
              </div>
              <div className="debate-article-content">
                <h4 className="mb-2">{title}</h4>
                <p title={description}>{description}</p>
              </div>
              <p title={description}>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
