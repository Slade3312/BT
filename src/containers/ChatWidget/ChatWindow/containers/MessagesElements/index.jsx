import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  AttachmentsMessage,
  DateMessage,
  ManagerMessage,
  SystemMessage,
  UserMessage,
} from 'containers/ChatWidget/ChatWindow/components';
import { getFormattedDate } from 'utils/date';
import { checkIsUserMessage } from 'containers/WebSocketChatConnector/utils';
import { StoresContext } from 'store/mobx';
import { getFormattedChatTime } from 'containers/ChatWidget/utils';

export default function MessagesElements({ onReachTopDetection }) {
  const {
    Chat: {
      allMessagesWithDatesAndSystemInfo,
    },
  } = useContext(StoresContext);

  const existingObserver = useRef();
  const lazyAnchorNode = useRef(null);
  const helpRef = useRef({ isComponentHasMount: false });

  /* called before useEffect and any time when node has updated */
  const handleLazyRefChange = element => {
    lazyAnchorNode.current = element;

    if (helpRef.current.isComponentHasMount) {
      updateObserverForAnchor(element);
    }
  };

  const updateObserverForAnchor = (element) => {
    if (existingObserver.current) {
      existingObserver.current.disconnect();
    }

    if (element) {
      existingObserver.current = new IntersectionObserver(
        async (entries) => {
          const firstEntry = entries[0];

          if (firstEntry.isIntersecting) {
            onReachTopDetection();
          }
        },
        { threshold: 1.0, root: null },
      );

      requestAnimationFrame(() => {
        existingObserver.current.observe(element);
      });
    }
  };

  useEffect(() => {
    helpRef.current.isComponentHasMount = true;

    requestAnimationFrame(() => {
      updateObserverForAnchor(lazyAnchorNode.current);
    });

    return () => existingObserver.current?.disconnect();
  }, []);

  return (
    <>
      {allMessagesWithDatesAndSystemInfo.map((message, index, target) => {
        const curMessageNodes = [];

        // we start load next items earlier than reach of a last node
        if (index === 5) {
          curMessageNodes.push(<div key="lazyRef" ref={handleLazyRefChange} />);
        }

        if (message.isDateMessage) {
          curMessageNodes.push(<DateMessage key={`date-${message.id}`} text={getFormattedDate(message.message)} isFirst={message.isFirst} />);
        }

        if (message.is_system_message) {
          curMessageNodes.push(<SystemMessage files={message.files} key={`system-${message.id}`} text={message.message} />);
        } else if (message.operator_message) {
          curMessageNodes.push(<ManagerMessage
            isHideAvatar={target[index + 1]?.operator_message}
            key={`manager-${message.id}`}
            text={message.message}
            time={getFormattedChatTime(message.date_time_message)}
            manager={{ name: message.sender_name, photoSrc: message.photo }}
            files={message.files}
          />);
        }

        if (checkIsUserMessage(message)) {
          curMessageNodes.push(<UserMessage
            key={`user-${message.id}`}
            text={message.message}
            files={message.files}
            time={getFormattedChatTime(message.date_time_message || Date.now())}
          />);
        }

        if (message?.files?.length > 0) {
          curMessageNodes.push(<AttachmentsMessage key={`attachments-${message.id}`} files={message?.files} />);
        }

        return curMessageNodes;
      })}
    </>
  );
}

MessagesElements.propTypes = {
  onReachTopDetection: PropTypes.func,
};
