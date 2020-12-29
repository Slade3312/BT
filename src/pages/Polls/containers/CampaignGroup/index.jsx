import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { IconLink } from 'components/buttons';
import { StoresContext } from 'store/mobx';
import { LimitedTextContainer, ColumnCell } from 'components/common';
import { CAMPAIGN_STATUSES, ORDER_STATUSES } from 'constants/index';
import DeleteButtonControls from '../DeleteButtonControls';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles, ...commonStyles });
const FILE_ID = {
  Отчёт: 1,
  Анкета: 4,
};

function CampaignGroup() {
  const { Polls, Templates } = useContext(StoresContext);
  const { profile, report } = Templates.getPollsTemplate('PollsList');

  return Polls?.pollsList?.map((poll) => {
    const reportData = poll.orders[0]?.files?.find(item => item.type_id === FILE_ID['Отчёт']);
    const profileData = poll.orders[0]?.files?.find(item => item.type_id === FILE_ID['Анкета']);
    const isCanBeRemoved = poll.orders[0]?.status_id === ORDER_STATUSES.CANCELED || poll.status_id === CAMPAIGN_STATUSES.COMPLETED;

    return (
      <li className={cx('component')} key={poll.id}>
        <ColumnCell type="name">
          <LimitedTextContainer
            className={cx('campaignName')}
          >
            <span title={poll.name}>{poll.name}</span>
          </LimitedTextContainer>
        </ColumnCell>

        <ColumnCell type="status">
          <LimitedTextContainer>
            {poll.status}
          </LimitedTextContainer>
        </ColumnCell>

        <ColumnCell type="date">
          <div>{poll.create_date}</div>
        </ColumnCell>

        <ColumnCell type="right">
          {profileData &&
            <IconLink
              href={profileData.file}
              slug="writedPaper"
              className={cx('iconLink')}
              target="_blank"
            >
              {profile}
            </IconLink>
          }

        </ColumnCell>
        {reportData &&
          <ColumnCell>
            <IconLink
              href={reportData.file}
              className={cx('iconLink')}
              target="_blank"
            >
              {report}
            </IconLink>
          </ColumnCell>
        }
        {isCanBeRemoved &&
          <DeleteButtonControls pollId={poll.id} />
        }
      </li>
    );
  });
}

export default observer(CampaignGroup);
