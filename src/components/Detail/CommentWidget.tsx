import styled from '@emotion/styled';
import React, { createRef, FunctionComponent, useEffect } from 'react';

const CommentBox = styled.div`
  width: 100%;
  margin-top: 60px;
  border-top: 2px solid ${({ theme }) => theme.colors.bluegray[300]};
  padding-top: 60px;
  .giscus {
    max-width: 960px;
    width: 100%;
  }
`;

type GiscusAttributesType = {
  src: string;
  'data-repo': string;
  'data-repo-id': string;
  'data-category': string;
  'data-category-id': string;
  'data-mapping': string;
  'data-strict': string;
  'data-reactions-enabled': string;
  'data-emit-metadata': string;
  'data-input-position': string;
  'data-theme': string;
  'data-lang': string;
  crossorigin: string;
  async: string;
};

const CommentWidget: FunctionComponent = function () {
  const element = createRef<HTMLDivElement>();

  useEffect(() => {
    if (element.current === null) return;

    const giscus: HTMLScriptElement = document.createElement('script');

    const attributes: GiscusAttributesType = {
      src: 'https://giscus.app/client.js',
      'data-repo': 'Chocochip101/Chocochip101.github.io',
      'data-repo-id': 'R_kgDONvU42Q',
      'data-category': 'Comments',
      'data-category-id': 'DIC_kwDONvU42c4CmWbF',
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': 'preferred_color_scheme',
      'data-lang': 'ko',
      crossorigin: 'anonymous',
      async: 'true',
    };

    Object.entries(attributes).forEach(([key, value]) => {
      giscus.setAttribute(key, value);
    });

    element.current.appendChild(giscus);
  }, []);

  return <CommentBox ref={element} />;
};

export default CommentWidget;
