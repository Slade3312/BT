import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { navigate, useLocation, useParams } from '@reach/router';
import PageLayout from 'pages/_PageLayout';
import { StoresContext } from 'store/mobx';
import { FAQ_URL } from 'pages/constants';
import { PageLoader } from 'components/common/Loaders/components';
import { normalizeEndOfUrl } from 'utils/router';
import { scrollTo } from 'utils/scroll';

import { FaqTitle } from './components';
import { QuestionCategory } from './containers';

const Faq = observer(() => {
  const { Faq: FaqStore } = useContext(StoresContext);
  const params = useParams();

  useEffect(() => {
    scrollTo(0);

    Promise.all([
      FaqStore.getCategories(),
    ]);
  }, []);

  useEffect(() => {
    if (!FaqStore.categories.length) return;

    if (params.faqPage && FaqStore.getUrlIdsList.includes(params.faqPage)) {
      FaqStore.set('currentCategoryId', params.faqPage);
    }
  }, [params.faqPage, FaqStore.categories]);

  return (
    <FaqWrapper>
      <PageLayout>
        <FaqTitle>Помощь</FaqTitle>
        {params.faqPage ? <QuestionCategory /> : null }
      </PageLayout>
    </FaqWrapper>
  );
});

const FaqWrapper = observer(({ children }) => {
  const { Faq: FaqStore } = useContext(StoresContext);
  const location = useLocation();
  const params = useParams();
  useEffect(() => {
    if (!FaqStore.categories.length) return;

    if (normalizeEndOfUrl(location.pathname) === FAQ_URL) {
      navigate(`${FAQ_URL}${FaqStore?.categories[0].url}`);
      FaqStore.set('currentCategoryId', FaqStore?.categories[0].url);
    } else if (FaqStore.getUrlIdsList.includes(params.faqPage)) {
      FaqStore.set('currentCategoryId', params.faqPage);
    } else {
      navigate('/404');
    }
  }, [FaqStore?.categories]);

  return !FaqStore.isLoaded ? <PageLoader isLoading={!FaqStore.isLoaded} /> : children;
});

export default Faq;

