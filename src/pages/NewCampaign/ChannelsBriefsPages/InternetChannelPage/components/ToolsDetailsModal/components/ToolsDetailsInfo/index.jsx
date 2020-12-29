import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import htmlReactParser from 'html-react-parser';
import { getDictionariesTools } from 'store/NewCampaign/dictionaries/selectors';

import ActionButton from 'components/buttons/ActionButtons/ActionButton';
import { Heading } from 'components/layouts';

import styles from './styles.pcss';

const mapStateToProps = state => ({
  tools: getDictionariesTools(state),
});

const ToolsDetailsInfo = ({ tools, onClose }) => {
  const toolsDictionary = useMemo(() => {
    const dict = {};

    for (let i = 0; i < tools.length; i += 1) {
      dict[tools[i].id] = {
        ...tools[i],
        modal_description: tools[i].modal_description ? htmlReactParser(tools[i].modal_description) : '',
      };
    }

    return dict;
  }, [tools]);

  /*
  * Backend gives us unsorted list of tools
  * So we need to sort it by groups to show it correctly
  */
  const groups = useMemo(() => {
    const arr = [];

    for (let i = 0; i < tools.length; i += 1) {
      // Minimal infotech_tool_type_id === 1, but I want to start array with zero :)
      if (arr[tools[i].infotech_tool_type_id - 1]) {
        arr[tools[i].infotech_tool_type_id - 1].push(tools[i]);
      } else {
        arr[tools[i].infotech_tool_type_id - 1] = [tools[i]];
      }
    }

    // Here we just sort tools in group by their position field
    for (let i = 0; i < arr.length; i += 1) {
      arr[i].sort((first, second) => {
        if (first.position > second.position) {
          return 1;
        }
        if (first.position < second.position) {
          return -1;
        }
        return 0;
      });
    }

    return arr;
  }, [tools]);

  // After all sortings we need to show the first element of first group by default
  const [activeElementId, setActiveElementId] = useState(groups[0][0].id);

  return (
    <div className={styles.wrapper}>
      <Heading level={2}>
        Инструменты интернет-рекламы
      </Heading>

      <div className={styles.groups}>
        {groups.map((item, i) => (
          <div className={styles.group} key={`${item + i}`}>
            <p className={styles.groupTitle}>
              {item[0].infotech_tool_type_name}
            </p>

            <div className={styles.groupItemsBlock}>
              {item.map(itm => (
                <div
                  key={itm.name}
                  className={`${styles.item} ${itm.id === activeElementId && styles.activeItem}`}
                  onClick={() => setActiveElementId(itm.id)}
                >
                  <img
                    src={itm.icon}
                    alt={itm.name}
                    className={styles.icon}
                  />
                </div>
              ))}
            </div>
          </div>
          ))}
      </div>

      <div className={styles.contentBlock}>
        {toolsDictionary[activeElementId].modal_description}
      </div>

      <div>
        {toolsDictionary[activeElementId]?.examples?.map(item => <img src={item.icon} alt="" key={item.icon} />)}
      </div>

      <ActionButton className={styles.closeButton} onClick={onClose}>
        Закрыть
      </ActionButton>
    </div>
  );
};

ToolsDetailsInfo.propTypes = {
  tools: PropTypes.arrayOf(PropTypes.shape({
    infotech_tool_type_id: PropTypes.number,
    infotech_tool_type_name: PropTypes.string,
    modal_description: PropTypes.string,
    id: PropTypes.number,
    examples: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string,
    })),
  })),
  onClose: PropTypes.func,
};

export default connect(mapStateToProps)(ToolsDetailsInfo);
